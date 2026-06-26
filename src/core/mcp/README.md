# MCP (Model Context Protocol)

Exposes the API to AI tools (Claude, IDEs, agents, …) as a set of **MCP tools**.
Each bounded context contributes its own tools; this `core/mcp` module owns the
shared transport and discovery wiring.

## At a glance

- **SDK**: official `@modelcontextprotocol/sdk` (`McpServer` + `StreamableHTTPServerTransport`).
- **Transport**: Streamable HTTP, **stateless** (a fresh server per request).
- **Endpoint**: `POST /api/mcp` (`GET`/`DELETE` return `405` — no sessions).
- **Auth/tenancy**: none. This service is a lean, single-tenant microservice
  with no authentication or spaces, so the per-request `IMcpToolContext` is
  currently empty.
- **Layer**: tools live in each context's `transport/mcp/` — they are inbound
  protocol adapters (like resolvers/controllers) and only dispatch through the
  Command/Query bus.

## How it fits together

```
POST /api/mcp
  → McpController
      → McpServerFactory.create({})                 // per request, empty context
          → registers every discovered IMcpTool on a new McpServer
      → StreamableHTTPServerTransport.handleRequest(req, res, body)
          → tool.execute(args, context)
              → CommandBus / QueryBus.execute(...)
```

The server is built per request and kept stateless: no session id is generated
and `GET`/`DELETE` (the SSE stream and session-termination verbs from the spec)
return `405`. Tools are request/response only, so the transport replies with a
single `application/json` JSON-RPC response.

## Building blocks

| File | Responsibility |
|------|----------------|
| `interfaces/mcp-tool.interface.ts` | `IMcpTool` contract every tool implements |
| `interfaces/mcp-tool-context.interface.ts` | per-request context (currently empty) |
| `decorators/mcp-tool.decorator.ts` | `@McpTool()` — marks a provider for discovery |
| `services/mcp-tool-registry.service.ts` | discovers tagged tools at bootstrap |
| `services/mcp-server.factory.ts` | builds a per-request `McpServer` |
| `transport/mcp.controller.ts` | the `/api/mcp` Streamable HTTP endpoint |
| `mcp.module.ts` | wires the transport (imported once in `AppModule`) |

## Adding tools to a bounded context

1. Define the input schema in its own file under
   `src/contexts/{context}/transport/mcp/schemas/{name}.schema.ts`:

   ```ts
   import { z } from 'zod';

   export const fooCreateSchema = {
     name: z.string().min(1).describe('Display name of the foo'),
   };
   ```

2. Create `src/contexts/{context}/transport/mcp/tools/{name}.tool.ts`:

   ```ts
   @McpTool()
   @Injectable()
   export class FooCreateMcpTool implements IMcpTool {
     private readonly logger = new Logger(FooCreateMcpTool.name);

     readonly name = 'foo_create';
     readonly title = 'Create foo';
     readonly description = 'Creates a foo in the shared catalog.';
     readonly inputSchema = fooCreateSchema;

     constructor(private readonly commandBus: CommandBus) {}

     async execute(args: Record<string, unknown>): Promise<CallToolResult> {
       const { name } = args as { name: string };
       this.logger.log(`Creating foo: ${name}`);
       const id = await this.commandBus.execute(new CreateFooCommand({ name }));
       return { content: [{ type: 'text', text: JSON.stringify({ id }) }] };
     }
   }
   ```

3. Register the tool classes in the context module's `TRANSPORT_PROVIDERS` array
   and spread it into `providers` (the `@McpTool()` metadata makes them
   discoverable globally — no need to export them).

### Conventions

- **Schemas** — each tool's Zod `inputSchema` lives in its own file under
  `transport/mcp/schemas/`, never inline in the tool.
- **Bus only** — tools dispatch Commands/Queries, never inject services/repos.
- **Naming** — `snake_case` tool names, prefixed by the entity (`plant_species_create`).
- **Logging** — log at entry (transport rule), like resolvers/controllers.
- **Input** — describe every field with `.describe(...)` so the AI client has
  good schemas.

## TypeScript note

The SDK is ESM-only and ships its public API behind the package `exports` map,
which the project's `node10` module resolution does not read for type lookup.
Three `paths` aliases in `tsconfig.json` map the `*.js` specifiers to the SDK's
type declarations **for `tsc` only** — the emitted `require(...)` strings are
untouched and resolved by Node at runtime via the `exports` map.

## Wired contexts

| Context | Tools |
|---------|-------|
| plant-species | create, update, delete, ingest, find by id, find by criteria |

## Cursor IDE setup

1. Start the API locally (`pnpm start:dev`).
2. Add an MCP server entry to `.cursor/mcp.json` pointing at the local endpoint
   (no auth headers are required):

   ```json
   {
     "mcpServers": {
       "gardenia-plant-species": {
         "url": "http://localhost:3000/api/mcp"
       }
     }
   }
   ```

Cursor loads project MCP servers from `.cursor/mcp.json`. Restart Cursor or
reload MCP servers after editing the file.
