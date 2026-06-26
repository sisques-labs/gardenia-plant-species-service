import { z } from 'zod';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';

const classification = z
  .object({
    kingdom: z.string().nullable().optional(),
    phylum: z.string().nullable().optional(),
    class: z.string().nullable().optional(),
    order: z.string().nullable().optional(),
    family: z.string().nullable().optional(),
    genus: z.string().nullable().optional(),
    specificEpithet: z.string().nullable().optional(),
    rank: z.string().nullable().optional(),
  })
  .describe('Linnaean classification');

const authorship = z
  .object({
    author: z.string().nullable().optional(),
    year: z.number().int().nullable().optional(),
  })
  .describe('Nomenclatural authorship');

const commonName = z.object({
  name: z.string().min(1),
  language: z.string().nullable().optional(),
});

const image = z.object({
  url: z.string().url(),
  isPrimary: z.boolean(),
});

const externalId = z.object({
  scheme: z.string().min(1),
  value: z.string().min(1),
});

/** Input schema for the `plant_species_update` MCP tool. */
export const plantSpeciesUpdateSchema = {
  id: z.string().uuid().describe('Id of the plant species to update'),
  scientificName: z.string().min(1).optional().describe('New scientific name'),
  description: z
    .string()
    .nullable()
    .optional()
    .describe('New description, or null to clear'),
  imageUrl: z
    .string()
    .url()
    .nullable()
    .optional()
    .describe('New image URL, or null to clear'),
  classification: classification
    .nullable()
    .optional()
    .describe('New classification, or null to clear'),
  authorship: authorship
    .nullable()
    .optional()
    .describe('New authorship, or null to clear'),
  growthHabit: z
    .nativeEnum(PlantSpeciesGrowthHabitEnum)
    .nullable()
    .optional()
    .describe('New growth form, or null to clear'),
  wikipediaUrl: z
    .string()
    .url()
    .nullable()
    .optional()
    .describe('New Wikipedia URL, or null to clear'),
  commonNames: commonName
    .array()
    .optional()
    .describe('Replacement set of vernacular (common) names'),
  images: image.array().optional().describe('Replacement image gallery'),
  externalIds: externalId
    .array()
    .optional()
    .describe('Replacement set of external catalog cross-references'),
};
