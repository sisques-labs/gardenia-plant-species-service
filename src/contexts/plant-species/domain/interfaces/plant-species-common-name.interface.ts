/** A vernacular (common) name in a given language. */
export interface IPlantSpeciesCommonName {
  name: string;
  /** BCP-47 / ISO-639 language code (e.g. "en", "es"), or null when unknown. */
  language: string | null;
}
