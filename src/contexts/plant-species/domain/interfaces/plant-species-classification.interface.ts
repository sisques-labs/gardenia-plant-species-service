/**
 * Linnaean classification of a species. Every rank is optional because external
 * sources rarely populate the full chain. `rank` is the taxonomic rank of the
 * record itself (typically "SPECIES"), kept as a free string to tolerate the wide
 * vocabulary GBIF/Wikidata use (e.g. SUBSPECIES, VARIETY, FORM).
 */
export interface IPlantSpeciesClassification {
  kingdom: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string | null;
  specificEpithet: string | null;
  rank: string | null;
}
