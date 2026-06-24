# Agent Skills — gardenia-plant-species-service

Project-specific guidance for code agents working on this repo.

## Code Conventions

Project-wide code conventions (tech stack, architecture, testing, style, and
apply-time rules) live in [openspec/config.yaml](openspec/config.yaml). Consult
that file for the authoritative list of coding standards before implementing or
reviewing changes.

## Architecture

DDD + CQRS + Hexagonal, organized by bounded context under `src/contexts/<context>`:

- `application/` — commands, queries, ports, services (read/write)
- `domain/` — aggregates, builders, events, value-objects, repositories, exceptions
- `infrastructure/` — persistence (typeorm), adapters (anti-corruption seam)
- `transport/` — rest, graphql, mcp

Cross-context imports are forbidden by `eslint-plugin-boundaries`: a context may
only reach another context through a port (`application/ports`) implemented by an
adapter (`infrastructure/adapters`).

Cross-cutting concerns live in `src/core` (config, filters, health) and shared
support in `src/support` (logging).
