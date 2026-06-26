import { registerEnumType } from '@nestjs/graphql';

import { PlantSpeciesGrowthHabitEnum } from '@contexts/plant-species/domain/enums/plant-species-growth-habit.enum';

// Side-effect module: registers the domain enums with the GraphQL schema so they can be
// referenced from response DTOs. Imported for its side effects by the context module.
registerEnumType(PlantSpeciesGrowthHabitEnum, {
  name: 'PlantSpeciesGrowthHabit',
  description: 'Coarse growth form of a plant species.',
});

export const registeredPlantSpeciesEnums: unknown[] = [
  PlantSpeciesGrowthHabitEnum,
];
