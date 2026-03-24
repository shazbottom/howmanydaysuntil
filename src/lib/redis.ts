import "server-only";

import { Redis as UpstashRedis } from "@upstash/redis";
import net from "node:net";
import tls from "node:tls";

type RedisConfigSource =
  | "upstash-rest"
  | "vercel-kv-rest"
  | "redis-url"
  | "rediss-url";

interface RedisConfigurationStatus {
  configured: boolean;
  source?: RedisConfigSource;
  error?: string;
}

interface RedisClientLike {
  get<T>(key: string): Promise<T | null>;
  set(
    key: string,
    value: unknown,
    options?: {
      ex?: number;
    },
  ): Promise<string | null>;
  exists(key: string): Promise<number>;
  del(key: string): Promise<number>;
}

interface UpstashConfig {
  source: "upstash-rest" | "vercel-kv-rest";
}

interface UrlConfig {
  source: "redis-url" | "rediss-url";
  url: URL;
}

type RedisConfig = UpstashConfig | UrlConfig;

let redisClient: RedisClientLike | null = null;

function getRedisConfig(): RedisConfig | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { source: "upstash-rest" };
  }

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return { source: "vercel-kv-rest" };
  }

  if (process.env.REDIS_URL) {
    try {
      const parsedUrl = new URL(process.env.REDIS_URL);

      if (parsedUrl.protocol === "redis:") {
        return {
          source: "redis-url",
          url: parsedUrl,
        };
      }

      if (parsedUrl.protocol === "rediss:") {
        return {
          source: "rediss-url",
          url: parsedUrl,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function getRedisConfigurationStatus(): RedisConfigurationStatus {
  const config = getRedisConfig();

  if (config) {
    return {
      configured: true,
      source: config.source,
    };
  }

  if (process.env.REDIS_URL) {
    return {
      configured: false,
      error:
        "Found REDIS_URL, but it is not a valid redis:// or rediss:// URL. Supported configurations are UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, KV_REST_API_URL + KV_REST_API_TOKEN, or REDIS_URL as a standard Redis connection string.",
    };
  }

  return {
    configured: false,
    error:
      "Missing Redis environment variables. Supported configurations are UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, KV_REST_API_URL + KV_REST_API_TOKEN, or REDIS_URL as a standard Redis connection string.",
  };
}

export function isRedisConfigured(): boolean {
  return getRedisConfigurationStatus().configured;
}

class RedisProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RedisProtocolError";
  }
}

class StandardRedisClient implements RedisClientLike {
  constructor(private readonly url: URL) {}

  async get<T>(key: string): Promise<T | null> {
    const response = await this.sendCommand(["GET", key]);

    if (response === null) {
      return null;
    }

    if (typeof response !== "string") {
      throw new RedisProtocolError("Unexpected Redis response for GET.");
    }

    return this.parseValue<T>(response);
  }

  async set(
    key: string,
    value: unknown,
    options?: {
      ex?: number;
    },
  ): Promise<string | null> {
    const command = ["SET", key, this.stringifyValue(value)];

    if (options?.ex) {
      command.push("EX", String(options.ex));
    }

    const response = await this.sendCommand(command);

    if (response === null) {
      return null;
    }

    if (typeof response !== "string") {
      throw new RedisProtocolError("Unexpected Redis response for SET.");
    }

    return response;
  }

  async exists(key: string): Promise<number> {
    const response = await this.sendCommand(["EXISTS", key]);

    if (typeof response !== "number") {
      throw new RedisProtocolError("Unexpected Redis response for EXISTS.");
    }

    return response;
  }

  async del(key: string): Promise<number> {
    const response = await this.sendCommand(["DEL", key]);

    if (typeof response !== "number") {
      throw new RedisProtocolError("Unexpected Redis response for DEL.");
    }

    return response;
  }

  private stringifyValue(value: unknown): string {
    return typeof value === "string" ? value : JSON.stringify(value);
  }

  private parseValue<T>(value: string): T {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  private async sendCommand(command: string[]): Promise<string | number | null> {
    const socket = await this.connect();

    try {
      if (this.url.password) {
        const authArgs = this.url.username
          ? ["AUTH", decodeURIComponent(this.url.username), decodeURIComponent(this.url.password)]
          : ["AUTH", decodeURIComponent(this.url.password)];

        const authResponse = await this.writeAndRead(socket, authArgs);

        if (authResponse !== "OK") {
          throw new RedisProtocolError("Redis AUTH failed.");
        }
      }

      return await this.writeAndRead(socket, command);
    } finally {
      socket.end();
      socket.destroy();
    }
  }

  private connect(): Promise<net.Socket | tls.TLSSocket> {
    const host = this.url.hostname;
    const port = this.url.port ? Number(this.url.port) : 6379;
    const useTls = this.url.protocol === "rediss:";

    return new Promise((resolve, reject) => {
      const socket = useTls
        ? tls.connect({
            host,
            port,
            servername: host,
          })
        : net.createConnection({
            host,
            port,
          });

      const timeoutMs = 5000;

      socket.setTimeout(timeoutMs, () => {
        socket.destroy(new Error("Redis connection timed out."));
      });

      socket.once("connect", () => {
        socket.setTimeout(0);
        resolve(socket);
      });

      socket.once("error", (error) => {
        reject(error);
      });
    });
  }

  private writeAndRead(
    socket: net.Socket | tls.TLSSocket,
    command: string[],
  ): Promise<string | number | null> {
    const payload = encodeRedisCommand(command);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      const handleData = (chunk: Buffer) => {
        chunks.push(chunk);

        try {
          const result = parseRedisReply(Buffer.concat(chunks));
          cleanup();
          resolve(result.value);
        } catch (error) {
          if (error instanceof IncompleteRedisReplyError) {
            return;
          }

          cleanup();
          reject(error);
        }
      };

      const handleError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const handleClose = () => {
        cleanup();
        reject(new RedisProtocolError("Redis connection closed before a response was received."));
      };

      const cleanup = () => {
        socket.off("data", handleData);
        socket.off("error", handleError);
        socket.off("close", handleClose);
      };

      socket.on("data", handleData);
      socket.once("error", handleError);
      socket.once("close", handleClose);
      socket.write(payload);
    });
  }
}

class UpstashRedisClient implements RedisClientLike {
  constructor(private readonly client: UpstashRedis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get<T>(key);
    return value ?? null;
  }

  async set(
    key: string,
    value: unknown,
    options?: {
      ex?: number;
    },
  ): Promise<string | null> {
    const result = options?.ex
      ? await this.client.set(key, value, { ex: options.ex })
      : await this.client.set(key, value);
    return result == null ? null : String(result);
  }

  async exists(key: string): Promise<number> {
    const result = await this.client.exists(key);
    return Number(result);
  }

  async del(key: string): Promise<number> {
    const result = await this.client.del(key);
    return Number(result);
  }
}

class IncompleteRedisReplyError extends Error {
  constructor() {
    super("Incomplete Redis reply.");
    this.name = "IncompleteRedisReplyError";
  }
}

function encodeRedisCommand(command: string[]): Buffer {
  const parts = [`*${command.length}\r\n`];

  for (const arg of command) {
    const value = Buffer.from(arg, "utf8");
    parts.push(`$${value.length}\r\n`);
    parts.push(value.toString("utf8"));
    parts.push("\r\n");
  }

  return Buffer.from(parts.join(""), "utf8");
}

function parseRedisReply(buffer: Buffer): {
  value: string | number | null;
  offset: number;
} {
  if (buffer.length === 0) {
    throw new IncompleteRedisReplyError();
  }

  const type = String.fromCharCode(buffer[0]);

  switch (type) {
    case "+":
      return parseSimpleString(buffer);
    case ":":
      return parseInteger(buffer);
    case "$":
      return parseBulkString(buffer);
    case "-": {
      const error = parseSimpleString(buffer);
      throw new RedisProtocolError(String(error.value));
    }
    default:
      throw new RedisProtocolError(`Unsupported Redis reply type: ${type}`);
  }
}

function parseSimpleString(buffer: Buffer): {
  value: string;
  offset: number;
} {
  const endIndex = findCrlf(buffer, 1);
  const value = buffer.subarray(1, endIndex).toString("utf8");

  return {
    value,
    offset: endIndex + 2,
  };
}

function parseInteger(buffer: Buffer): {
  value: number;
  offset: number;
} {
  const endIndex = findCrlf(buffer, 1);
  const rawValue = buffer.subarray(1, endIndex).toString("utf8");

  return {
    value: Number(rawValue),
    offset: endIndex + 2,
  };
}

function parseBulkString(buffer: Buffer): {
  value: string | null;
  offset: number;
} {
  const lengthEndIndex = findCrlf(buffer, 1);
  const rawLength = buffer.subarray(1, lengthEndIndex).toString("utf8");
  const length = Number(rawLength);

  if (length === -1) {
    return {
      value: null,
      offset: lengthEndIndex + 2,
    };
  }

  const valueStart = lengthEndIndex + 2;
  const valueEnd = valueStart + length;

  if (buffer.length < valueEnd + 2) {
    throw new IncompleteRedisReplyError();
  }

  return {
    value: buffer.subarray(valueStart, valueEnd).toString("utf8"),
    offset: valueEnd + 2,
  };
}

function findCrlf(buffer: Buffer, startIndex: number): number {
  const endIndex = buffer.indexOf("\r\n", startIndex, "utf8");

  if (endIndex === -1) {
    throw new IncompleteRedisReplyError();
  }

  return endIndex;
}

export function getRedis(): RedisClientLike | null {
  const config = getRedisConfig();

  if (!config) {
    return null;
  }

  if (!redisClient) {
    if (config.source === "upstash-rest" || config.source === "vercel-kv-rest") {
      redisClient = new UpstashRedisClient(UpstashRedis.fromEnv());
    } else if (config.source === "redis-url" || config.source === "rediss-url") {
      redisClient = new StandardRedisClient(config.url);
    }
  }

  return redisClient;
}
