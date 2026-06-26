import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { IPlantSpeciesQueuePort } from '@contexts/plant-species/application/ports/plant-species-queue.port';
import { PLANT_SPECIES_REDIS_CLIENT } from '@contexts/plant-species/infrastructure/redis/plant-species-redis.client';

/**
 * Redis-backed implementation of the queue port.
 *
 * Each species name is pushed as a plain string onto a Redis list, which the
 * gardenia-plant-species-worker drains with BRPOP (from the tail). A single LPUSH
 * inserts its arguments at the head one by one, so `LPUSH key a b c` leaves the list
 * as [c, b, a] and the worker receives a, b, c — FIFO is preserved in one round-trip.
 */
@Injectable()
export class RedisPlantSpeciesQueueAdapter implements IPlantSpeciesQueuePort {
  private readonly logger = new Logger(RedisPlantSpeciesQueueAdapter.name);
  private readonly queueName: string;

  constructor(
    @Inject(PLANT_SPECIES_REDIS_CLIENT) private readonly redis: Redis,
    config: ConfigService,
  ) {
    this.queueName = config.get<string>('redis.queueName', 'plant-species');
  }

  async enqueue(names: string[]): Promise<void> {
    if (names.length === 0) {
      return;
    }

    this.logger.log(
      `Pushing ${names.length} plant species name(s) onto Redis queue "${this.queueName}"`,
    );

    await this.redis.lpush(this.queueName, ...names);

    this.logger.log(
      `Enqueued ${names.length} plant species name(s) onto "${this.queueName}"`,
    );
  }
}
