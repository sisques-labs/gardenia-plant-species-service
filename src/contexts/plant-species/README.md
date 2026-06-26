# Plant Species Context

Owns the plant species catalog: it **stores and serves** species data and
**enqueues** species names for the worker to process. Fetching data from
external sources (GBIF, Wikidata, …) is **not** this service's responsibility —
that lives in `gardenia-plant-species-worker`, which writes the enriched data
back into the shared database. Follows the project's DDD + CQRS + Hexagonal
layering.

## Domain model

`PlantSpeciesAggregate` holds, beyond `scientificName`/`description`/`imageUrl`:

| Group | Fields | Storage |
|-------|--------|---------|
| Taxonomy | `classification` (kingdom→specificEpithet, rank), `authorship` (author, year) | columns on `plant_species` |
| Ecology / links | `growthHabit` (enum), `wikipediaUrl` | columns on `plant_species` |
| Common names | `commonNames[]` (name, language) | table `plant_species_common_name` |
| Images | `images[]` (url, isPrimary) | table `plant_species_image` |
| External ids | `externalIds[]` (scheme, value) | table `plant_species_external_id` |

`scheme` on external ids is a free-form string (e.g. `"GBIF"`, `"WIKIDATA"`,
`"POWO"`) set by the worker — the service does not couple to any specific source.
Child collections are modelled as value-object arrays on the aggregate and persisted
as cascaded one-to-many tables. `imageUrl` is the cover image (also present in
`images` with `isPrimary = true`). The rich fields are written by the worker
directly into the shared DB; this service reads and serves them.

## Public API

### Commands

| Command | Purpose |
|---------|---------|
| `CreatePlantSpeciesCommand` | Add a species to the catalog (full field set: scientificName, description, imageUrl, classification, authorship, growthHabit, wikipediaUrl, commonNames, images, externalIds) |
| `UpdatePlantSpeciesCommand` | Update a species (any of the create fields; only provided fields change) |
| `DeletePlantSpeciesCommand` | Remove a species |
| `IngestPlantSpeciesCommand` | Enqueue species names for the worker to consume |

### Queries

| Query | Purpose |
|-------|---------|
| `PlantSpeciesFindByIdQuery` | Get a species by id |
| `PlantSpeciesFindByCriteriaQuery` | Paginated/filtered list |

### Ports

| Port | Adapter | Purpose |
|------|---------|---------|
| `IPlantSpeciesQueuePort` | `RedisPlantSpeciesQueueAdapter` | Enqueue species names onto the worker's Redis queue |
| `IPlantSpeciesReferencePort` | `PlantSpeciesReferenceAdapter` | Count plants referencing a species (delete guard) |

### Transport

- GraphQL: `plant-species` resolvers (queries, mutations — incl. `ingestPlantSpecies`).
- REST: `PlantSpeciesController` (incl. `POST /plant-species/ingest`).
- MCP: see below.

### Ingest queue

`IngestPlantSpeciesCommand` pushes each species name as a plain string onto a Redis
list (config `redis.queueName`, default `plant-species`) via `IPlantSpeciesQueuePort`.
The `gardenia-plant-species-worker` drains that list with `BRPOP`, fetches the data
from external sources, and persists the enriched species into the shared database.
The queue name MUST match the worker's `QUEUE_NAME`. Order is preserved
(single `LPUSH` + tail `BRPOP`).

## MCP Tools

Exposed under `transport/mcp/` for AI clients (see `src/core/mcp/README.md`).
Each tool dispatches through the Command/Query bus.

| Tool | Action |
|------|--------|
| `plant_species_create` | Create a species |
| `plant_species_update` | Update a species |
| `plant_species_delete` | Delete a species |
| `plant_species_ingest` | Enqueue species names for the worker |
| `plant_species_find_by_id` | Get a species by id |
| `plant_species_find_by_criteria` | Paginated list of species |
