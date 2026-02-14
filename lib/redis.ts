import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only create Redis client when we have a valid HTTPS URL and token.
const redis =
  redisUrl?.startsWith("https") && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : undefined;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "@synscript/ratelimit",
    })
  : undefined;

export { redis, ratelimit };
