import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@sisques-labs/nestjs-kit';

import { PlantSpeciesViewModel } from '@contexts/plant-species/domain/view-models/plant-species.view-model';

import { PaginatedPlantSpeciesResultDto } from '@contexts/plant-species/transport/graphql/dtos/responses/paginated-plant-species-result.dto';
import { PlantSpeciesResponseDto } from '@contexts/plant-species/transport/graphql/dtos/responses/plant-species.response.dto';

@Injectable()
export class PlantSpeciesGraphQLMapper {
  toResponseDtoFromViewModel(
    vm: PlantSpeciesViewModel,
  ): PlantSpeciesResponseDto {
    return {
      id: vm.id,
      scientificName: vm.scientificName,
      description: vm.description,
      imageUrl: vm.imageUrl,
      classification: vm.classification,
      authorship: vm.authorship,
      growthHabit: vm.growthHabit,
      wikipediaUrl: vm.wikipediaUrl,
      commonNames: vm.commonNames,
      images: vm.images,
      externalIds: vm.externalIds,
      createdAt: vm.createdAt,
      updatedAt: vm.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<PlantSpeciesViewModel>,
  ): PaginatedPlantSpeciesResultDto {
    return {
      items: paginatedResult.items.map((vm) =>
        this.toResponseDtoFromViewModel(vm),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
