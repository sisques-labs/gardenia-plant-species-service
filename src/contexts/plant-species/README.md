# Plant Species Context

Maintains the shared catalog of plant species (scientific name, description,
image) and imports/enriches species data from external sources. Follows the
project's DDD + CQRS + Hexagonal layering.

## Public API

### Commands

| Command | Purpose |
|---------|---------|
| `CreatePlantSpeciesCommand` | Add a species to the catalog |
| `UpdatePlantSpeciesCommand` | Update a species |
| `DeletePlantSpeciesCommand` | Remove a species |
| `EnrichPlantSpeciesCommand` | Enrich a species from external data |
| `ImportPlantSpeciesCommand` | Import a batch from the external catalog |
| `IngestPlantSpeciesCommand` | Enqueue species names for the worker to consume |

### Queries

| Query | Purpose |
|-------|---------|
| `PlantSpeciesFindByIdQuery` | Get a species by id |
| `PlantSpeciesFindByCriteriaQuery` | Paginated/filtered list |

### Ports

| Port | Adapter | Purpose |
|------|---------|---------|
| `IPlantSpeciesImportPort` | `GbifPlantSpeciesImportAdapter` | Fetch/enrich species from the external catalog |
| `IPlantSpeciesQueuePort` | `RedisPlantSpeciesQueueAdapter` | Enqueue species names onto the worker's Redis queue |

### Transport

- GraphQL: `plant-species` resolvers (queries, mutations — incl. `ingestPlantSpecies`).
- REST: `PlantSpeciesController` (incl. `POST /plant-species/ingest`).
- MCP: see below.

### Ingest queue

`IngestPlantSpeciesCommand` pushes each species name as a plain string onto a Redis
list (config `redis.queueName`, default `plant-species`) via `IPlantSpeciesQueuePort`.
The `gardenia-plant-species-worker` drains that list with `BRPOP`. The queue name MUST
match the worker's `QUEUE_NAME`. Order is preserved (single `LPUSH` + tail `BRPOP`).

## MCP Tools

Exposed under `transport/mcp/` for AI clients (see `src/core/mcp/README.md`).
Each tool dispatches through the Command/Query bus.

| Tool | Action |
|------|--------|
| `plant_species_create` | Create a species |
| `plant_species_update` | Update a species |
| `plant_species_delete` | Delete a species |
| `plant_species_enrich` | Enrich a species from external data |
| `plant_species_import` | Import a batch of species |
| `plant_species_ingest` | Enqueue species names for the worker |
| `plant_species_find_by_id` | Get a species by id |
| `plant_species_find_by_criteria` | Paginated list of species |
