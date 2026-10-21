const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`
});

redisClient.on('error', (err) => {
  console.warn('[Redis] Connection warning (optional cache):', err.message);
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully to Redis server');
});

// Connect lazily
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.warn('[Redis] Could not connect immediately:', err.message);
  }
})();

module.exports = redisClient;
