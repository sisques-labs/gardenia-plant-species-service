# Changelog

All notable changes to this project will be documented in this file.
## [0.1.0-alpha.0] - 2026-06-26

### Bug Fixes
- **ci:** Force jest to exit after e2e and integration test runs (98dc7c5)
- **test:** Truncate plant_species with CASCADE in integration setup (d2f95bc)

### Chore
- First commit (7308b98)
- Add express dependency to package.json and update pnpm-lock.yaml (6242946)

### Features
- Scaffold DDD/CQRS/hexagonal service skeleton (0f06f7d)
- **plant-species:** Port full bounded context with REST/GraphQL/MCP transports (93bab38)
- **plant-species:** Add ingest endpoint to enqueue species onto Redis (6e9fcf5)
- **plant-species:** Enrich domain model with taxonomy and external sources (1f2c084)
- **plant-species:** Expose full field set on create and update (123f5af)
- **plant-species:** Emit per-field changed events for enriched fields (b9c1905)

### Refactor
- **plant-species:** Remove external-source concerns from the service (c938523)
- **plant-species:** Align scaffold with project conventions (438fd37)
- **plant-species:** Address PR review comments (49b34f5)
- **plant-species:** Move primitives to primitives folder, derive update props (c14f42c)
- **plant-species:** Throw domain exceptions from value objects (649780f)

### Testing
- **plant-species:** Add delete handler unit + repository integration suite (104d6ce)

