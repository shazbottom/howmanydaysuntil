import { NextResponse } from "next/server";
import {
  getRedis,
  getRedisConfigurationStatus,
} from "../../../lib/redis";

export async function GET() {
  const configurationStatus = getRedisConfigurationStatus();

  if (!configurationStatus.configured) {
    return NextResponse.json(
      {
        ok: false,
        error: configurationStatus.error,
      },
      { status: 500 },
    );
  }

  try {
    const redis = getRedis();

    if (!redis) {
      return NextResponse.json(
        {
          ok: false,
          error: "Redis client could not be initialized.",
        },
        { status: 500 },
      );
    }

    const key = "test:redis";
    const expectedValue = "hello";

    await redis.set(key, expectedValue, { ex: 60 });
    const value = await redis.get<string>(key);

    return NextResponse.json({
      ok: value === expectedValue,
      key,
      source: configurationStatus.source,
      written: expectedValue,
      read: value,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Redis read/write failed.",
      },
      { status: 500 },
    );
  }
}
