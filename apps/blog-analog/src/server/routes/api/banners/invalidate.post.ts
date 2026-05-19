import { createHash, timingSafeEqual } from 'node:crypto';
import { assertMethod, createError, defineEventHandler, getHeader } from 'h3';

import { CACHE_KEYS } from '../../../utils/cache-keys';
import { getRequiredEnv } from '../../../utils/env';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const secret = getHeader(event, 'x-purge-secret');
  const expectedSecret = getRequiredEnv(event, 'CACHE_PURGE_SECRET');

  if (typeof secret !== 'string' || typeof expectedSecret !== 'string') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const a = createHash('sha256').update(secret).digest();
  const b = createHash('sha256').update(expectedSecret).digest();
  if (!timingSafeEqual(a, b)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const CACHE_KV = getRequiredEnv(event, 'CACHE_KV');

  try {
    await CACHE_KV.delete(CACHE_KEYS.banners);
  } catch (err) {
    console.error('[cache purge] KV delete failed:', err?.message ?? 'unknown');
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to purge cache',
    });
  }

  return { purged: true };
});
