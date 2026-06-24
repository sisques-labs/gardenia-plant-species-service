/**
 * Coarse growth form of a plant species, as exposed by Wikidata's "plant growth
 * habit" (P3485) and similar statements. Kept intentionally coarse so it maps
 * cleanly from heterogeneous external vocabularies.
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
