/**
 * External taxonomic catalogs a species can be cross-referenced against.
 *
 * - GBIF: GBIF taxon/usage key
 * - WIKIDATA: Wikidata entity id (QID)
 * - POWO: Plants of the World Online id
 * - IPNI: International Plant Names Index id
 * - USDA: USDA PLANTS symbol
 * - WFO: World Flora Online id
 */
export enum PlantSpeciesExternalIdSchemeEnum {
  GBIF = 'GBIF',
  WIKIDATA = 'WIKIDATA',
  POWO = 'POWO',
  IPNI = 'IPNI',
  USDA = 'USDA',
  WFO = 'WFO',
}
