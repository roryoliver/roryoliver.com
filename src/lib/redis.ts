import "server-only";
import { Redis } from "@upstash/redis";

let cached: Redis | null = null;

export function getRedis(): Redis | null {
  if (cached) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  cached = new Redis({ url, token });
  return cached;
}

export function requireRedis(): Redis {
  const r = getRedis();
  if (!r) {
    throw new Error(
      "Upstash Redis is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN",
    );
  }
  return r;
}
