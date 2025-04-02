import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';

type FetchConfig = Partial<Pick<RequestInit, 'method' | 'headers' | 'body'>>;

type WPOptions = {
  namespace?: string;
};

export type WPResponse<T> = {
  data: T;
  headers: Headers;
};

export class WPRestClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly fetchConfig: FetchConfig,
    protected readonly wpOptions?: WPOptions,
  ) {
    this.wpOptions = wpOptions ?? {
      namespace: 'wp/v2',
    };
  }

  get<T>(url: string, params: Record<string, string>): Promise<WPResponse<T>> {
    const searchParams = new URLSearchParams(params);
    return this.request(`${url}?${searchParams.toString()}`, { method: 'GET' });
  }

  private async request<T>(
    url: string,
    { body, headers, method }: FetchConfig = {},
  ): Promise<WPResponse<T>> {
    const request = await fetch(
      `${this.baseUrl}/wp-json/${this.wpOptions.namespace}/${url}`,
      {
        ...this.fetchConfig,
        method: method ?? 'GET',
        headers: {
          ...this.fetchConfig.headers,
          ...headers,
        },
        body,
      },
    );

    if (!request.ok) {
      const text = await request.text();
      throw new HTTPException(request.status as StatusCode, {
        message: text,
      });
    }

    return {
      data: await request.json(),
      headers: request.headers,
    };
  }
}

/**
 * Creates a new instance of the `WPRestClient`
 * @see WPRestClient
 */
export type WPClientFactory = (wpOptions?: WPOptions) => WPRestClient;

export function createWPRestClientFactory(
  baseUrl: string,
  fetchConfig?: FetchConfig,
): WPClientFactory {
  return (wpOptions) => new WPRestClient(baseUrl, fetchConfig ?? {}, wpOptions);
}
