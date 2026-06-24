export type GbifSpeciesMatchResponse = {
  matchType?: string;
  usageKey?: number;
  canonicalName?: string;
  scientificName?: string;
};

export type GbifSpeciesSearchResult = {
  key?: number;
  scientificName?: string;
  canonicalName?: string;
};

export type GbifSpeciesSearchResponse = {
  results?: GbifSpeciesSearchResult[];
};

export type GbifSpeciesDescriptionEntry = {
  description?: string;
  language?: string;
};

export type GbifSpeciesVernacularNameEntry = {
  vernacularName?: string;
  language?: string;
};

export type GbifSpeciesResponse = {
  key?: number;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  rank?: string;
  authorship?: string;
  descriptions?: GbifSpeciesDescriptionEntry[];
  vernacularNames?: GbifSpeciesVernacularNameEntry[];
};

export type GbifMediaResult = {
  identifier?: string;
};

export type GbifMediaResponse = {
  results?: GbifMediaResult[];
};
