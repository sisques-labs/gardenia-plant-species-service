/** A single value cell in a Wikidata SPARQL JSON result. */
export type WikidataSparqlValue = {
  type: string;
  value: string;
  'xml:lang'?: string;
};

export type WikidataSparqlBinding = Record<string, WikidataSparqlValue>;

export type WikidataSparqlResponse = {
  results?: {
    bindings?: WikidataSparqlBinding[];
  };
};
