import { z } from 'zod';

/** Input schema for the `plant_species_ingest` MCP tool. */
export const plantSpeciesIngestSchema = {
  names: z
    .array(z.string().min(1))
    .min(1)
    .describe('Plant species names to enqueue for asynchronous ingestion'),
};
