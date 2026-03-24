import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
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

const LOCAL_COUNTDOWN_STORE_PATH = path.join(
  process.cwd(),
  ".local-data",
  "custom-countdowns.json",
);

function shouldUseLocalCountdownStore(): boolean {
  return process.env.NODE_ENV !== "production" && !isRedisConfigured();
}

async function ensureLocalCountdownStoreDirectory() {
  await mkdir(path.dirname(LOCAL_COUNTDOWN_STORE_PATH), { recursive: true });
}

async function readLocalCountdownStore(): Promise<Record<string, CustomCountdown>> {
  try {
    const rawValue = await readFile(LOCAL_COUNTDOWN_STORE_PATH, "utf8");
    const parsedValue = JSON.parse(rawValue) as Record<string, CustomCountdown>;

    return parsedValue ?? {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeLocalCountdownStore(records: Record<string, CustomCountdown>) {
  await ensureLocalCountdownStoreDirectory();
  await writeFile(LOCAL_COUNTDOWN_STORE_PATH, JSON.stringify(records, null, 2), "utf8");
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

  if (shouldUseLocalCountdownStore()) {
    const titleSlug = slugifyTitle(input.title);
    const records = await readLocalCountdownStore();
    let slug = `${titleSlug}-${createSlugSuffix()}`;

    while (records[slug]) {
      slug = `${titleSlug}-${createSlugSuffix(6)}`;
    }

    const record = buildCustomCountdownRecord(input, slug);
    records[slug] = record;
    await writeLocalCountdownStore(records);

    return { record };
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
  if (shouldUseLocalCountdownStore()) {
    const records = await readLocalCountdownStore();
    return records[slug] ?? null;
  }

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

export async function deleteCustomCountdownBySlugFromRedis(
  slug: string,
): Promise<{ deleted: boolean; error?: string }> {
  if (shouldUseLocalCountdownStore()) {
    const records = await readLocalCountdownStore();

    if (!records[slug]) {
      return { deleted: false };
    }

    delete records[slug];
    await writeLocalCountdownStore(records);

    return { deleted: true };
  }

  if (!isRedisConfigured()) {
    return {
      deleted: false,
      error: "Countdown storage is not configured right now.",
    };
  }

  const redis = getRedis();

  if (!redis) {
    return {
      deleted: false,
      error: "Countdown storage is not available right now.",
    };
  }

  const redisKey = getCountdownRedisKey(slug);

  try {
    const deletedCount = await redis.del(redisKey);

    return {
      deleted: deletedCount > 0,
    };
  } catch (error) {
    console.error("[custom-countdown:delete] Redis delete failed", {
      slug,
      redisKey,
      error: error instanceof Error ? error.message : "unknown",
    });

    return {
      deleted: false,
      error: "Unable to delete this countdown right now. Please try again.",
    };
  }
}
