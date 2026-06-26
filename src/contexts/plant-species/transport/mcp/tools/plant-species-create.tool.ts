import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { McpTool } from '@core/mcp/decorators/mcp-tool.decorator';
import { IMcpTool } from '@core/mcp/interfaces/mcp-tool.interface';
import {
  CreatePlantSpeciesCommand,
  CreatePlantSpeciesCommandInput,
} from '@contexts/plant-species/application/commands/create-plant-species/create-plant-species.command';
import { plantSpeciesCreateSchema } from '@contexts/plant-species/transport/mcp/schemas/plant-species-create.schema';

@McpTool()
@Injectable()
export class PlantSpeciesCreateMcpTool implements IMcpTool {
  private readonly logger = new Logger(PlantSpeciesCreateMcpTool.name);

  readonly name = 'plant_species_create';
  readonly title = 'Create plant species';
  readonly description = 'Creates a plant species in the shared catalog.';
  readonly inputSchema = plantSpeciesCreateSchema;

  constructor(private readonly commandBus: CommandBus) {}

  async execute(args: Record<string, unknown>): Promise<CallToolResult> {
    const input = args as unknown as CreatePlantSpeciesCommandInput;
    this.logger.log(`Creating plant species: ${input.scientificName}`);

    const id = await this.commandBus.execute<CreatePlantSpeciesCommand, string>(
      new CreatePlantSpeciesCommand(input),
    );

    return {
      content: [{ type: 'text', text: JSON.stringify({ success: true, id }) }],
    };
  }
}
