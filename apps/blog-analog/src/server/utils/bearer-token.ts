import { createHash, timingSafeEqual } from 'node:crypto';
import { getHeader, H3Event } from 'h3';

/** Shorter configured tokens are treated as a misconfiguration. */
const MIN_TOKEN_LENGTH = 32;

/**
 * Whether the request carries `Authorization: Bearer <expected>`. Fails closed
 * when no token (or a too short one) is configured.
 */
export function hasBearerToken(
  event: H3Event,
  expected: string | null | undefined,
): boolean {
  if (!expected || expected.length < MIN_TOKEN_LENGTH) {
    console.error('[auth] bearer token is not configured or too short');
    return false;
  }

  const match = /^Bearer (.+)$/.exec(getHeader(event, 'authorization') ?? '');
  if (!match) {
    return false;
  }

  // Equal-length digests, so the comparison leaks neither content nor length.
  const provided = createHash('sha256').update(match[1]).digest();
  const wanted = createHash('sha256').update(expected).digest();
  return timingSafeEqual(provided, wanted);
}
