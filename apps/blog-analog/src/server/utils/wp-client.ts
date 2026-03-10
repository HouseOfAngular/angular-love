import { H3Event } from 'h3';

import {
  createWPRestClientFactory,
  type WPClientFactory,
} from '@angular-love/util-wp';

/**
 * Creates a WP REST client factory using Nitro runtime config.
 * Adapted from the Hono `wpClientMw` in `libs/blog-bff/shared/util-wp/wp-middleware.ts`.
 */
export function createWpClient(event: H3Event): WPClientFactory {
  const token = import.meta.env['WP_REST_API_TOKEN'] as string;
  const baseUrl = import.meta.env['WP_REST_API_BASE_URL'] as string;

  if (!token) throw new Error('WP_REST_API_TOKEN is not defined');

  return createWPRestClientFactory(baseUrl, {
    headers: { Authorization: token },
  });
}
