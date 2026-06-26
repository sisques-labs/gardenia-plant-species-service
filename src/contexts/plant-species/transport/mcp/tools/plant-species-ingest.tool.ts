import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { McpTool } from '@core/mcp/decorators/mcp-tool.decorator';
import { IMcpTool } from '@core/mcp/interfaces/mcp-tool.interface';
import { IngestPlantSpeciesCommand } from '@contexts/plant-species/application/commands/ingest-plant-species/ingest-plant-species.command';
import { plantSpeciesIngestSchema } from '@contexts/plant-species/transport/mcp/schemas/plant-species-ingest.schema';

@McpTool()
@Injectable()
export class PlantSpeciesIngestMcpTool implements IMcpTool {
  private readonly logger = new Logger(PlantSpeciesIngestMcpTool.name);

  readonly name = 'plant_species_ingest';
  readonly title = 'Ingest plant species';
  readonly description =
    'Enqueues a batch of plant species names for asynchronous ingestion by the worker.';
  readonly inputSchema = plantSpeciesIngestSchema;

  constructor(private readonly commandBus: CommandBus) {}

  async execute(args: Record<string, unknown>): Promise<CallToolResult> {
    const { names } = args as { names: string[] };
    this.logger.log(`Ingesting ${names.length} plant species name(s)`);

    const result = await this.commandBus.execute(
      new IngestPlantSpeciesCommand({ names }),
    );

    return {
      content: [
        { type: 'text', text: JSON.stringify(result ?? { success: true }) },
      ],
    };
  }
}
