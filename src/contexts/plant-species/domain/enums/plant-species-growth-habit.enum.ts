/**
 * Coarse growth form of a plant species. Kept intentionally coarse so it maps
 * cleanly from heterogeneous source vocabularies (set by the worker).
 */
export enum PlantSpeciesGrowthHabitEnum {
  TREE = 'TREE',
  SHRUB = 'SHRUB',
  SUBSHRUB = 'SUBSHRUB',
  HERB = 'HERB',
  GRASS = 'GRASS',
  VINE = 'VINE',
  SUCCULENT = 'SUCCULENT',
  FERN = 'FERN',
  BULB = 'BULB',
  AQUATIC = 'AQUATIC',
  OTHER = 'OTHER',
}
