import type { NextRequest } from "next/server";
import { getRedis, isRedisConfigured } from "../../../lib/redis";

const KEEPALIVE_KEY = "system:redis-keepalive";
const KEEPALIVE_TTL_SECONDS = 60 * 60 * 24 * 60;

function isAuthorized(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json(
      {
        ok: false,
        error:
          process.env.NODE_ENV === "production" && !process.env.CRON_SECRET
            ? "CRON_SECRET is not configured."
            : "Unauthorized.",
      },
      {
        status:
          process.env.NODE_ENV === "production" && !process.env.CRON_SECRET ? 500 : 401,
      },
    );
  }

  if (!isRedisConfigured()) {
    return Response.json(
      {
        ok: false,
        error: "Redis is not configured.",
      },
      { status: 503 },
    );
  }

  const redis = getRedis();

  if (!redis) {
    return Response.json(
      {
        ok: false,
        error: "Redis client is not available.",
      },
      { status: 503 },
    );
  }

  const touchedAt = new Date().toISOString();

  try {
    await redis.set(
      KEEPALIVE_KEY,
      {
        touchedAt,
      },
      { ex: KEEPALIVE_TTL_SECONDS },
    );

    const payload = await redis.get<{ touchedAt?: string }>(KEEPALIVE_KEY);

    return Response.json(
      {
        ok: true,
        touchedAt: payload?.touchedAt ?? touchedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Redis keepalive failed.",
      },
      { status: 500 },
    );
  }
}
