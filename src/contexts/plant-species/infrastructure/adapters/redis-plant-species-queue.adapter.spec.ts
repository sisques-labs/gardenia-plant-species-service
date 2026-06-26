import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { RedisPlantSpeciesQueueAdapter } from './redis-plant-species-queue.adapter';

describe('RedisPlantSpeciesQueueAdapter', () => {
  let redis: jest.Mocked<Pick<Redis, 'lpush'>>;
  let config: jest.Mocked<Pick<ConfigService, 'get'>>;
  let adapter: RedisPlantSpeciesQueueAdapter;

  beforeEach(() => {
    jest.clearAllMocks();

    redis = { lpush: jest.fn().mockResolvedValue(2) };
    config = { get: jest.fn().mockReturnValue('plant-species') };

    adapter = new RedisPlantSpeciesQueueAdapter(
      redis as unknown as Redis,
      config as unknown as ConfigService,
    );
  });

  it('LPUSHes every name onto the configured queue in order', async () => {
    await adapter.enqueue(['Rosa canina', 'Lavandula angustifolia']);

    expect(redis.lpush).toHaveBeenCalledWith(
      'plant-species',
      'Rosa canina',
      'Lavandula angustifolia',
    );
  });

  it('does nothing when there are no names to enqueue', async () => {
    await adapter.enqueue([]);

    expect(redis.lpush).not.toHaveBeenCalled();
  });
});
