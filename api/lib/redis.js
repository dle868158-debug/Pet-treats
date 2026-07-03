const { Redis } = require("@upstash/redis");
const { requiredEnv } = require("./env");

let redisClient = null;

function redis() {
  requiredEnv(["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]);
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
  }
  return redisClient;
}

module.exports = { redis };
