import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only create Redis client when we have a valid HTTPS URL and token.
// Placeholder values like "optional_for_rate_limit" must not be passed to the client.
const redis =
  redisUrl?.startsWith("https") && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : undefined;

export { redis };
