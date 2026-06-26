import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Criteria, PaginatedResult } from '@sisques-labs/nestjs-kit';

import { CreatePlantSpeciesCommand } from '@contexts/plant-species/application/commands/create-plant-species/create-plant-species.command';
import { DeletePlantSpeciesCommand } from '@contexts/plant-species/application/commands/delete-plant-species/delete-plant-species.command';
import { IngestPlantSpeciesCommand } from '@contexts/plant-species/application/commands/ingest-plant-species/ingest-plant-species.command';
import { IngestPlantSpeciesResult } from '@contexts/plant-species/application/commands/ingest-plant-species/ingest-plant-species.result';
import { UpdatePlantSpeciesCommand } from '@contexts/plant-species/application/commands/update-plant-species/update-plant-species.command';
import { PlantSpeciesFindByCriteriaQuery } from '@contexts/plant-species/application/queries/plant-species-find-by-criteria/plant-species-find-by-criteria.query';
import { PlantSpeciesFindByIdQuery } from '@contexts/plant-species/application/queries/plant-species-find-by-id/plant-species-find-by-id.query';
import { PlantSpeciesViewModel } from '@contexts/plant-species/domain/view-models/plant-species.view-model';

import { CreatePlantSpeciesDto } from '@contexts/plant-species/transport/rest/dtos/create-plant-species.dto';
import { IngestPlantSpeciesDto } from '@contexts/plant-species/transport/rest/dtos/ingest-plant-species.dto';
import { IngestPlantSpeciesResponseDto } from '@contexts/plant-species/transport/rest/dtos/ingest-plant-species-response.dto';
import { PlantSpeciesRestResponseDto } from '@contexts/plant-species/transport/rest/dtos/plant-species-rest-response.dto';
import { UpdatePlantSpeciesDto } from '@contexts/plant-species/transport/rest/dtos/update-plant-species.dto';
import { PlantSpeciesRestMapper } from '@contexts/plant-species/transport/rest/mappers/plant-species/plant-species.mapper';

@ApiTags('plant-species')
@Controller('plant-species')
export class PlantSpeciesController {
  private readonly logger = new Logger(PlantSpeciesController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly plantSpeciesRestMapper: PlantSpeciesRestMapper,
  ) {}

  @Post('ingest')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary:
      'Enqueue plant species names for asynchronous ingestion by the worker',
  })
  @ApiResponse({
    status: 202,
    description: 'Species names accepted and enqueued',
    type: IngestPlantSpeciesResponseDto,
  })
  async ingestPlantSpecies(
    @Body() dto: IngestPlantSpeciesDto,
  ): Promise<IngestPlantSpeciesResponseDto> {
    this.logger.log(`Ingesting ${dto.names.length} plant species name(s)`);

    return this.commandBus.execute<
      IngestPlantSpeciesCommand,
      IngestPlantSpeciesResult
    >(new IngestPlantSpeciesCommand({ names: dto.names }));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a plant species catalog entry' })
  @ApiResponse({
    status: 201,
    description: 'Plant species created successfully',
    type: PlantSpeciesRestResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Name already exists' })
  async createPlantSpecies(
    @Body() dto: CreatePlantSpeciesDto,
  ): Promise<PlantSpeciesRestResponseDto> {
    this.logger.log(`Creating plant species: ${dto.scientificName}`);

    const plantSpeciesId = await this.commandBus.execute<
      CreatePlantSpeciesCommand,
      string
    >(
      new CreatePlantSpeciesCommand({
        scientificName: dto.scientificName,
        description: dto.description,
        imageUrl: dto.imageUrl,
        classification: dto.classification,
        authorship: dto.authorship,
        growthHabit: dto.growthHabit,
        wikipediaUrl: dto.wikipediaUrl,
        commonNames: dto.commonNames,
        images: dto.images,
        externalIds: dto.externalIds,
      }),
    );

    const vm = await this.queryBus.execute<
      PlantSpeciesFindByIdQuery,
      PlantSpeciesViewModel
    >(new PlantSpeciesFindByIdQuery({ plantSpeciesId }));

    return this.plantSpeciesRestMapper.toResponse(vm);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all plant species catalog entries' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated plant species catalog entries',
  })
  async listPlantSpecies(): Promise<
    PaginatedResult<PlantSpeciesRestResponseDto>
  > {
    const criteria = new Criteria(undefined, undefined, undefined);
    const result = await this.queryBus.execute<
      PlantSpeciesFindByCriteriaQuery,
      PaginatedResult<PlantSpeciesViewModel>
    >(new PlantSpeciesFindByCriteriaQuery({ criteria }));

    const items = result.items.map((vm) =>
      this.plantSpeciesRestMapper.toResponse(vm),
    );

    return new PaginatedResult(
      items,
      result.total,
      result.page,
      result.perPage,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a plant species catalog entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the plant species catalog entry',
    type: PlantSpeciesRestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plant species not found' })
  async getPlantSpecies(
    @Param('id') id: string,
  ): Promise<PlantSpeciesRestResponseDto> {
    const vm = await this.queryBus.execute<
      PlantSpeciesFindByIdQuery,
      PlantSpeciesViewModel
    >(new PlantSpeciesFindByIdQuery({ plantSpeciesId: id }));

    return this.plantSpeciesRestMapper.toResponse(vm);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a plant species catalog entry' })
  @ApiResponse({
    status: 200,
    description: 'Plant species updated successfully',
    type: PlantSpeciesRestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plant species not found' })
  @ApiResponse({ status: 409, description: 'Name already exists' })
  async updatePlantSpecies(
    @Param('id') id: string,
    @Body() dto: UpdatePlantSpeciesDto,
  ): Promise<PlantSpeciesRestResponseDto> {
    this.logger.log(`Updating plant species: ${id}`);

    await this.commandBus.execute(
      new UpdatePlantSpeciesCommand({
        id,
        scientificName: dto.scientificName,
        description: dto.description,
        imageUrl: dto.imageUrl,
        classification: dto.classification,
        authorship: dto.authorship,
        growthHabit: dto.growthHabit,
        wikipediaUrl: dto.wikipediaUrl,
        commonNames: dto.commonNames,
        images: dto.images,
        externalIds: dto.externalIds,
      }),
    );

    const vm = await this.queryBus.execute<
      PlantSpeciesFindByIdQuery,
      PlantSpeciesViewModel
    >(new PlantSpeciesFindByIdQuery({ plantSpeciesId: id }));

    return this.plantSpeciesRestMapper.toResponse(vm);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a plant species catalog entry' })
  @ApiResponse({
    status: 204,
    description: 'Plant species deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Plant species not found' })
  @ApiResponse({ status: 409, description: 'Plant species is in use' })
  async deletePlantSpecies(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePlantSpeciesCommand({ id }));
  }
}
