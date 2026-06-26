import { PlantSpeciesFindByIdQuery } from '@contexts/plant-species/application/queries/plant-species-find-by-id/plant-species-find-by-id.query';
import { AssertPlantSpeciesViewModelExistsService } from '@contexts/plant-species/application/services/read/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { PlantSpeciesViewModel } from '@contexts/plant-species/domain/view-models/plant-species.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(PlantSpeciesFindByIdQuery)
export class PlantSpeciesFindByIdQueryHandler implements IQueryHandler<PlantSpeciesFindByIdQuery> {
  private readonly logger = new Logger(PlantSpeciesFindByIdQueryHandler.name);

  constructor(
    private readonly assertPlantSpeciesViewModelExistsService: AssertPlantSpeciesViewModelExistsService,
  ) {}

  async execute(
    query: PlantSpeciesFindByIdQuery,
  ): Promise<PlantSpeciesViewModel> {
    this.logger.log(
      `Finding plant species by id: ${query.plantSpeciesId.value}`,
    );

    return await this.assertPlantSpeciesViewModelExistsService.execute(
      query.plantSpeciesId,
    );
  }
}
