import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  IPlantSpeciesQueuePort,
  PLANT_SPECIES_QUEUE_PORT,
} from '@contexts/plant-species/application/ports/plant-species-queue.port';

import { IngestPlantSpeciesCommand } from './ingest-plant-species.command';
import { IngestPlantSpeciesResult } from './ingest-plant-species.result';

@CommandHandler(IngestPlantSpeciesCommand)
export class IngestPlantSpeciesCommandHandler implements ICommandHandler<
  IngestPlantSpeciesCommand,
  IngestPlantSpeciesResult
> {
  private readonly logger = new Logger(IngestPlantSpeciesCommandHandler.name);

  constructor(
    @Inject(PLANT_SPECIES_QUEUE_PORT)
    private readonly queuePort: IPlantSpeciesQueuePort,
  ) {}

  async execute(
    command: IngestPlantSpeciesCommand,
  ): Promise<IngestPlantSpeciesResult> {
    const names = command.names.map((name) => name.value);

    await this.queuePort.enqueue(names);

    this.logger.log(
      `Ingested ${names.length} plant species name(s) onto the queue`,
    );

    return { accepted: names.length };
  }
}
