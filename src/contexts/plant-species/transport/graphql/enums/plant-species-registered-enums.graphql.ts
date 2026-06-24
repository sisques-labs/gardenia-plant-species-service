import { registerEnumType } from '@nestjs/graphql';

import { PlantSpeciesExternalIdSchemeEnum } from '@contexts/plant-species/domain/enums/plant-species-external-id-scheme.enum';
import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';
import { PlantSpeciesSourceEnum } from '@contexts/plant-species/domain/enums/plant-species-source.enum';

// Side-effect module: registers the domain enums with the GraphQL schema so they can be
// referenced from response DTOs. Imported for its side effects by the context module.
registerEnumType(PlantSpeciesSourceEnum, {
  name: 'PlantSpeciesSource',
  description:
    'Origin of a plant species record or field (GBIF, Wikidata, manual).',
});

registerEnumType(PlantSpeciesGrowthHabitEnum, {
  name: 'PlantSpeciesGrowthHabit',
  description: 'Coarse growth form of a plant species.',
});

registerEnumType(PlantSpeciesExternalIdSchemeEnum, {
  name: 'PlantSpeciesExternalIdScheme',
  description: 'External catalog a species is cross-referenced against.',
});

export const registeredPlantSpeciesEnums: unknown[] = [
  PlantSpeciesSourceEnum,
  PlantSpeciesGrowthHabitEnum,
  PlantSpeciesExternalIdSchemeEnum,
];
