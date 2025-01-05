import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', // your Redis server host
  port: 6379, // your Redis server port
  maxRetriesPerRequest: 100, // increase the max retries per request
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
});

redis.on('error', (err) => {
  if ((err as any).code === 'ECONNRESET') {
    console.error('Redis connection was reset. Attempting to reconnect...');
  } else {
    console.error('Redis error:', err);
  }
});

redis.on('close', () => {
  console.error('Redis connection closed. Attempting to reconnect...');
  redis.connect().catch((err) => {
    console.error('Failed to reconnect to Redis:', err);
  });
});

export default redis;