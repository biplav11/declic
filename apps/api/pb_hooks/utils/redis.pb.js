/// <reference path="../../pb_data/types.d.ts" />

const Redis = require("../../node_modules/@ioredis");

const url = $os.getenv("REDIS_URL");
if (!url) {
    throw new Error("REDIS_URL env var is required for pb_hooks/utils/redis.pb.js");
}

const client = new Redis(url);

module.exports = client;
