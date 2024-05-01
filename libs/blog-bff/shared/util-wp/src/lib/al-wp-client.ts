import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';

import { WPRespone, WPRestClient } from './wp-client';

type FetchConfig = Partial<Pick<RequestInit, 'method' | 'headers' | 'body'>>;

export class ALWPRestClient implements WPRestClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly fetchConfig: FetchConfig,
  ) {}

  get<T>(url: string, params: Record<string, string>): Promise<WPRespone<T>> {
    const searchParams = new URLSearchParams(params);
    return this.request(`${url}?${searchParams.toString()}`, { method: 'GET' });
  }

  private async request<T>(
    url: string,
    { body, headers, method }: FetchConfig = {},
  ): Promise<WPRespone<T>> {
    const request = await fetch(`${this.baseUrl}/wp-json/wp/v2/${url}`, {
      ...this.fetchConfig,
      method: method ?? 'GET',
      headers: {
        ...this.fetchConfig.headers,
        ...headers,
      },
      body,
    });

    if (!request.ok) {
      throw new HTTPException(
        request.status as StatusCode,
        await request.json(),
      );
    }

    return {
      data: await request.json(),
      headers: request.headers,
    };
  }
}
