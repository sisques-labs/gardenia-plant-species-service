import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { McpTool } from '@core/mcp/decorators/mcp-tool.decorator';
import { IMcpTool } from '@core/mcp/interfaces/mcp-tool.interface';
import {
  UpdatePlantSpeciesCommand,
  UpdatePlantSpeciesCommandInput,
} from '@contexts/plant-species/application/commands/update-plant-species/update-plant-species.command';
import { plantSpeciesUpdateSchema } from '@contexts/plant-species/transport/mcp/schemas/plant-species-update.schema';

@McpTool()
@Injectable()
export class PlantSpeciesUpdateMcpTool implements IMcpTool {
  private readonly logger = new Logger(PlantSpeciesUpdateMcpTool.name);

  readonly name = 'plant_species_update';
  readonly title = 'Update plant species';
  readonly description =
    'Updates a plant species in the catalog. Only provided fields are changed.';
  readonly inputSchema = plantSpeciesUpdateSchema;

  constructor(private readonly commandBus: CommandBus) {}

  async execute(args: Record<string, unknown>): Promise<CallToolResult> {
    const input = args as unknown as UpdatePlantSpeciesCommandInput;
    this.logger.log(`Updating plant species: ${input.id}`);

    await this.commandBus.execute(new UpdatePlantSpeciesCommand(input));

    return {
      content: [
        { type: 'text', text: JSON.stringify({ success: true, id: input.id }) },
      ],
    };
  }
}
