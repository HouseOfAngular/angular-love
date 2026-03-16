import { createError, H3Event } from 'h3';

/**
 * Safely extracts the Cloudflare environment from the H3 event.
 */
export const getEnv = (event: H3Event): Env | undefined => {
  return event.context.cloudflare?.env;
};

/**
 * Retrieves a required environment variable or throws a secure 500 error.
 * Using a getter returns the value directly and preserves strong typing.
 */
export function getRequiredEnv<K extends keyof Env>(
  event: H3Event,
  key: K,
): NonNullable<Env[K]> {
  const env = getEnv(event);

  if (!env) {
    console.error(
      '[FATAL] Cloudflare environment context is missing in H3 event.',
    );

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const value = env[key];

  if (value === undefined || value === null || value === '') {
    console.error(
      `[FATAL] Missing required Cloudflare environment variable: ${String(key)}`,
    );

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  return value as NonNullable<Env[K]>;
}

export function getOptionalEnv<K extends keyof Env>(
  event: H3Event,
  key: K,
): Env[K] | null {
  const env = getEnv(event);

  if (!env) {
    console.error(
      '[FATAL] Cloudflare environment context is missing in H3 event.',
    );

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const value = env[key];

  return value as Env[K] | null;
}
