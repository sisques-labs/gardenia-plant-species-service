/**
 * Nomenclatural authorship of a species name, e.g. author "L." and year 1753 for
 * Linnaeus. Both fields are optional since not every source supplies them.
 */
export interface IPlantSpeciesAuthorship {
  author: string | null;
  year: number | null;
}
