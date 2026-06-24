import { z } from 'zod';

import { validateProductionCorsOrigins } from './cors-origins';

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map(
      (issue) =>
        `  - ${issue.path.length > 0 ? issue.path.join('.') : '(root)'}: ${issue.message}`,
    )
    .join('\n');
}

const baseEnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  DATABASE_DRIVER: z.string().optional(),
  DATABASE_HOST: z.string().trim().min(1, 'DATABASE_HOST must not be empty'),
  DATABASE_PORT: z.string().optional(),
  DATABASE_USERNAME: z
    .string()
    .trim()
    .min(1, 'DATABASE_USERNAME must not be empty'),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD must not be empty'),
  DATABASE_DATABASE: z
    .string()
    .trim()
    .min(1, 'DATABASE_DATABASE must not be empty'),
});

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const parsed = baseEnvSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(
      `Environment validation failed:\n${formatZodIssues(parsed.error.issues)}`,
    );
  }

  if (parsed.data.NODE_ENV === 'production') {
    const productionErrors = validateProductionCorsOrigins({
      CORS_ORIGINS:
        typeof config.CORS_ORIGINS === 'string'
          ? config.CORS_ORIGINS
          : undefined,
      FRONTEND_URL:
        typeof config.FRONTEND_URL === 'string'
          ? config.FRONTEND_URL
          : undefined,
    });

    if (productionErrors.length > 0) {
      throw new Error(
        `Environment validation failed:\n${productionErrors.join('\n')}`,
      );
    }
  }

  return config;
}
