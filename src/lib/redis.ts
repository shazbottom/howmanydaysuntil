import "server-only";

import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

type RedisConfigSource =
  | "upstash-rest"
  | "vercel-kv-rest"
  | "redis-rest"
  | "redis-rest-url-token";

interface RedisEnvConfig {
  url: string;
  token: string;
  source: RedisConfigSource;
}

function isHttpRedisUrl(value: string): boolean {
  return value.startsWith("https://") || value.startsWith("http://");
}

function getRedisTokenFromUrl(value: string): string | null {
  if (!isHttpRedisUrl(value)) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.searchParams.get("_token") ?? url.searchParams.get("token");
  } catch {
    return null;
  }
}

function getRedisEnvConfig(): RedisEnvConfig | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      source: "upstash-rest",
    };
  }

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return {
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
      source: "vercel-kv-rest",
    };
  }

  if (process.env.REDIS_URL && isHttpRedisUrl(process.env.REDIS_URL)) {
    const tokenFromUrl = getRedisTokenFromUrl(process.env.REDIS_URL);

    if (tokenFromUrl) {
      return {
        url: process.env.REDIS_URL,
        token: tokenFromUrl,
        source: "redis-rest-url-token",
      };
    }
  }

  if (
    process.env.REDIS_URL &&
    process.env.REDIS_TOKEN &&
    isHttpRedisUrl(process.env.REDIS_URL)
  ) {
    return {
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
      source: "redis-rest",
    };
  }

  return null;
}

export function getRedisConfigurationStatus(): {
  configured: boolean;
  source?: RedisConfigSource;
  error?: string;
} {
  const config = getRedisEnvConfig();

  if (config) {
    return {
      configured: true,
      source: config.source,
    };
  }

  if (process.env.REDIS_URL && !process.env.REDIS_TOKEN) {
    if (isHttpRedisUrl(process.env.REDIS_URL)) {
      return {
        configured: false,
        error:
          "Found REDIS_URL, but no REST token could be resolved. This app uses the Upstash HTTP client and needs either UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, KV_REST_API_URL + KV_REST_API_TOKEN, or an HTTP REDIS_URL that already includes a token parameter.",
      };
    }

    return {
      configured: false,
      error:
        "Found REDIS_URL without REDIS_TOKEN, and it is not an HTTP REST endpoint. This app uses @upstash/redis, which requires an Upstash REST URL and token rather than a raw redis:// connection string.",
    };
  }

  if (
    process.env.REDIS_URL &&
    process.env.REDIS_TOKEN &&
    !isHttpRedisUrl(process.env.REDIS_URL)
  ) {
    return {
      configured: false,
      error:
        "Found REDIS_URL and REDIS_TOKEN, but REDIS_URL is not an HTTP REST endpoint. This app uses @upstash/redis and expects UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL + KV_REST_API_TOKEN.",
    };
  }

  return {
    configured: false,
    error:
      "Missing Redis environment variables. Supported pairs: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, KV_REST_API_URL + KV_REST_API_TOKEN, or an HTTP REDIS_URL + REDIS_TOKEN pair.",
  };
}

export function isRedisConfigured(): boolean {
  return getRedisConfigurationStatus().configured;
}

export function getRedis(): Redis | null {
  const config = getRedisEnvConfig();

  if (!config) {
    return null;
  }

  if (!redisClient) {
    if (config.source === "upstash-rest" || config.source === "vercel-kv-rest") {
      redisClient = Redis.fromEnv();
    } else {
      redisClient = new Redis({
        url: config.url,
        token: config.token,
      });
    }
  }

  return redisClient;
}
