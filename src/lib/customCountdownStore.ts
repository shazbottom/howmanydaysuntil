import "server-only";

import { getCountdown } from "./countdown";
import {
  buildCustomCountdownRecord,
  createLocalDateFromIso,
  createSlugSuffix,
  slugifyTitle,
  validateCustomCountdownInput,
  type CreateCustomCountdownInput,
  type CustomCountdown,
  type CustomCountdownPageData,
} from "./customCountdowns";
import { getRedis, isRedisConfigured } from "./redis";

function getCountdownRedisKey(slug: string): string {
  return `countdown:${slug}`;
}

export async function createCustomCountdownInRedis(
  input: CreateCustomCountdownInput,
): Promise<{
  record?: CustomCountdown;
  errors?: {
    title?: string;
    targetDate?: string;
    timezone?: string;
    note?: string;
    form?: string;
  };
}> {
  const errors = validateCustomCountdownInput(input);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (!isRedisConfigured()) {
    return {
      errors: {
        form: "Countdown storage is not configured right now. Please try again later.",
      },
    };
  }

  const redis = getRedis();

  if (!redis) {
    return {
      errors: {
        form: "Countdown storage is not available right now. Please try again later.",
      },
    };
  }

  const titleSlug = slugifyTitle(input.title);
  let slug = `${titleSlug}-${createSlugSuffix()}`;

  while (await redis.exists(getCountdownRedisKey(slug))) {
    slug = `${titleSlug}-${createSlugSuffix(6)}`;
  }

  const record = buildCustomCountdownRecord(input, slug);
  const redisKey = getCountdownRedisKey(slug);

  try {
    await redis.set(redisKey, record);
    const persistedRecord = await redis.get<CustomCountdown>(redisKey);

    if (!persistedRecord || persistedRecord.slug !== slug) {
      console.warn("[custom-countdown:create] Redis write verification failed", {
        slug,
        redisKey,
        persisted: Boolean(persistedRecord),
      });

      return {
        errors: {
          form: "Unable to save this countdown right now. Please try again.",
        },
      };
    }

    console.info("[custom-countdown:create] Stored countdown", {
      slug,
      redisKey,
    });

    return { record };
  } catch (error) {
    console.error("[custom-countdown:create] Redis write failed", {
      slug,
      redisKey,
      error: error instanceof Error ? error.message : "unknown",
    });

    return {
      errors: {
        form: "Unable to save this countdown right now. Please try again.",
      },
    };
  }
}

export async function findCustomCountdownBySlugFromRedis(
  slug: string,
): Promise<CustomCountdown | null> {
  if (!isRedisConfigured()) {
    return null;
  }

  const redis = getRedis();

  if (!redis) {
    return null;
  }

  const redisKey = getCountdownRedisKey(slug);

  try {
    const record = await redis.get<CustomCountdown>(redisKey);

    console.info("[custom-countdown:read] Lookup", {
      slug,
      redisKey,
      found: Boolean(record),
    });

    return record ?? null;
  } catch (error) {
    console.error("[custom-countdown:read] Redis read failed", {
      slug,
      redisKey,
      error: error instanceof Error ? error.message : "unknown",
    });

    return null;
  }
}

export async function getCustomCountdownPageDataFromRedis(
  slug: string,
): Promise<CustomCountdownPageData | null> {
  const record = await findCustomCountdownBySlugFromRedis(slug);

  if (!record) {
    return null;
  }

  const targetDate = createLocalDateFromIso(record.targetDate);

  if (!targetDate) {
    return null;
  }

  let countdown: ReturnType<typeof getCountdown> | null = null;

  try {
    countdown = getCountdown(targetDate);
  } catch {
    countdown = null;
  }

  return {
    record,
    targetDate,
    countdown,
  };
}
