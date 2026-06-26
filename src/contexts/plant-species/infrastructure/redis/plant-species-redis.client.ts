import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

/** DI token for the ioredis client used by the plant-species queue adapter. */
export const PLANT_SPECIES_REDIS_CLIENT = Symbol('PLANT_SPECIES_REDIS_CLIENT');

/**
 * Builds the shared ioredis client from config. Connection details come from
 * `redis.config.ts`, so the same image works across environments via env vars.
 */
export const plantSpeciesRedisClientProvider: Provider = {
  provide: PLANT_SPECIES_REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Redis =>
    new Redis({
      host: config.get<string>('redis.host', 'localhost'),
      port: config.get<number>('redis.port', 6379),
      // Keep retrying commands instead of failing fast, so an ingest survives a brief
      // Redis blip rather than erroring immediately.
      maxRetriesPerRequest: null,
    }),
};
