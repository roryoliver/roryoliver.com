import "server-only";
import { getRedis } from "./redis";

export type ClientConfig = {
  slug: string;
  displayName: string;
  jiraProjectKey: string;
  jiraJqlExtra?: string;
  allowedEmails: string[];
  brandColor?: string;
};

const SEED_CLIENTS: Record<string, ClientConfig> = {
  tra: {
    slug: "tra",
    displayName: "The Radiology Academy",
    jiraProjectKey: "TRA",
    allowedEmails: ["i@roryoliver.com"],
  },
};

const KEY_PREFIX = "client:";
const EMAIL_INDEX_PREFIX = "client-emails:";

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function fromSeed(slug: string): ClientConfig | null {
  const c = SEED_CLIENTS[slug];
  if (!c) return null;
  return {
    ...c,
    allowedEmails: c.allowedEmails.map(normaliseEmail),
  };
}

export async function getClientConfig(
  slug: string,
): Promise<ClientConfig | null> {
  const redis = getRedis();
  if (redis) {
    const stored = await redis.get<ClientConfig>(`${KEY_PREFIX}${slug}`);
    if (stored) {
      return {
        ...stored,
        allowedEmails: (stored.allowedEmails ?? []).map(normaliseEmail),
      };
    }
  }
  return fromSeed(slug);
}

export async function listClientsForEmail(email: string): Promise<string[]> {
  const e = normaliseEmail(email);
  const redis = getRedis();
  if (redis) {
    const stored = await redis.smembers(`${EMAIL_INDEX_PREFIX}${e}`);
    if (stored && stored.length > 0) return stored;
  }
  return Object.values(SEED_CLIENTS)
    .filter((c) => c.allowedEmails.map(normaliseEmail).includes(e))
    .map((c) => c.slug);
}

export async function upsertClientConfig(config: ClientConfig): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Cannot persist client config: Upstash Redis is not configured",
    );
  }
  const previous = await redis.get<ClientConfig>(`${KEY_PREFIX}${config.slug}`);
  const previousEmails = (previous?.allowedEmails ?? []).map(normaliseEmail);
  const nextEmails = config.allowedEmails.map(normaliseEmail);

  await redis.set(`${KEY_PREFIX}${config.slug}`, {
    ...config,
    allowedEmails: nextEmails,
  });

  const removed = previousEmails.filter((e) => !nextEmails.includes(e));
  const added = nextEmails.filter((e) => !previousEmails.includes(e));

  await Promise.all([
    ...removed.map((e) =>
      redis.srem(`${EMAIL_INDEX_PREFIX}${e}`, config.slug),
    ),
    ...added.map((e) => redis.sadd(`${EMAIL_INDEX_PREFIX}${e}`, config.slug)),
  ]);
}
