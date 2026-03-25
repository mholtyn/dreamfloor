import { Redis } from '@upstash/redis';

export default async function handler(request, response) {
  try {
    const redisClient = Redis.fromEnv();
    const redisCounterKey = 'dreamfloor:global_lineup_counter_v1';

    if (request.method === 'GET') {
      const countValue = await redisClient.get(redisCounterKey);
      const normalizedCountValue = typeof countValue === 'number' ? countValue : 0;
      response.status(200).json({ count: normalizedCountValue });
      return;
    }

    if (request.method === 'POST') {
      const updatedCountValue = await redisClient.incr(redisCounterKey, 1);
      response.status(200).json({ count: updatedCountValue });
      return;
    }

    response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

