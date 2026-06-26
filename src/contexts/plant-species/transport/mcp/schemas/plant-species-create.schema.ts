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

/** Input schema for the `plant_species_create` MCP tool. */
export const plantSpeciesCreateSchema = {
  scientificName: z
    .string()
    .min(1)
    .describe('Scientific (botanical) name of the species'),
  description: z.string().nullable().optional().describe('Species description'),
  imageUrl: z
    .string()
    .url()
    .nullable()
    .optional()
    .describe('Cover/primary species image URL'),
  classification: classification.nullable().optional(),
  authorship: authorship.nullable().optional(),
  growthHabit: z
    .nativeEnum(PlantSpeciesGrowthHabitEnum)
    .nullable()
    .optional()
    .describe('Coarse growth form'),
  wikipediaUrl: z
    .string()
    .url()
    .nullable()
    .optional()
    .describe('Wikipedia article URL'),
  commonNames: commonName
    .array()
    .optional()
    .describe('Vernacular (common) names'),
  images: image.array().optional().describe('Image gallery'),
  externalIds: externalId
    .array()
    .optional()
    .describe('External catalog cross-references'),
};
