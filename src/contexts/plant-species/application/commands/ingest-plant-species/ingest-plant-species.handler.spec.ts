import { IPlantSpeciesQueuePort } from '@contexts/plant-species/application/ports/plant-species-queue.port';

import { IngestPlantSpeciesCommand } from './ingest-plant-species.command';
import { IngestPlantSpeciesCommandHandler } from './ingest-plant-species.handler';

describe('IngestPlantSpeciesCommandHandler', () => {
  let handler: IngestPlantSpeciesCommandHandler;
  let queuePort: jest.Mocked<IPlantSpeciesQueuePort>;

  beforeEach(() => {
    jest.clearAllMocks();

    queuePort = {
      enqueue: jest.fn().mockResolvedValue(undefined),
    };

    handler = new IngestPlantSpeciesCommandHandler(queuePort);
  });

  it('enqueues every name in order and returns the accepted count', async () => {
    const result = await handler.execute(
      new IngestPlantSpeciesCommand({
        names: ['Rosa canina', 'Lavandula angustifolia'],
      }),
    );

    expect(queuePort.enqueue).toHaveBeenCalledWith([
      'Rosa canina',
      'Lavandula angustifolia',
    ]);
    expect(result).toEqual({ accepted: 2 });
  });

  it('normalizes names through the value object before enqueuing', async () => {
    await handler.execute(
      new IngestPlantSpeciesCommand({ names: ['  Tulipa gesneriana  '] }),
    );

    expect(queuePort.enqueue).toHaveBeenCalledWith(['Tulipa gesneriana']);
  });

  it('rejects an empty name via the value object', () => {
    expect(
      () => new IngestPlantSpeciesCommand({ names: ['Rosa canina', '   '] }),
    ).toThrow();
  });
});
