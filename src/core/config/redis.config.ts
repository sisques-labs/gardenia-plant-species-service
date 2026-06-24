import { registerAs } from '@nestjs/config';

/**
 * Redis connection + queue settings.
 *
 * `queueName` MUST match the worker's `QUEUE_NAME` (gardenia-plant-species-worker)
 * so the worker consumes exactly what the ingest endpoint enqueues. Default
 * (`plant-species`) mirrors the worker's default.
 */
export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  queueName: process.env.REDIS_QUEUE ?? 'plant-species',
}));
