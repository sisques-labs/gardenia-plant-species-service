/**
 * Per-request context handed to every MCP tool.
 *
 * This service has no authentication or multitenancy, so the context is
 * currently empty. Add request-scoped fields here (and populate them in the
 * MCP transport controller) if tools ever need resolved request state.
 */
export type IMcpToolContext = Record<string, never>;
