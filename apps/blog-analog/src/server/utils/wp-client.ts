import { H3Event } from 'h3';

import {
  createWPRestClientFactory,
  type WPClientFactory,
} from '@angular-love/util-wp';

import { getRequiredEnv } from './env';

export function createWpClient(event: H3Event): WPClientFactory {
  const token = getRequiredEnv(event, 'WP_REST_API_TOKEN');
  const baseUrl = getRequiredEnv(event, 'WP_REST_API_BASE_URL');

  return createWPRestClientFactory(baseUrl, {
    headers: { Authorization: token },
  });
}
