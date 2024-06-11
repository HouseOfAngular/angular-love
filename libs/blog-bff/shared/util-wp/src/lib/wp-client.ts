import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';

type FetchConfig = Partial<Pick<RequestInit, 'method' | 'headers' | 'body'>>;

export type WPRespone<T> = {
  data: T;
  headers: Headers;
};

export class WPRestClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly fetchConfig: FetchConfig,
  ) {}

  get<T>(url: string, params: Record<string, string>): Promise<WPRespone<T>> {
    const searchParams = new URLSearchParams(params);
    return this.request(`${url}?${searchParams.toString()}`, {
      method: 'GET',
    });
  }

  post<T>(name: string, body: T): Promise<WPRespone<T>> {
    const form: FormData = new FormData();
    form.append(name, body as string);

    return this.request(
      `subscribers`,
      {
        body: form,
        method: 'POST',
      },
      '/wp-json/newsletter/v2/',
    );
  }

  private async request<T>(
    url: string,
    { body, headers, method }: FetchConfig = {},
    namespace = '/wp-json/wp/v2/',
  ): Promise<WPRespone<T>> {
    const request = await fetch(`${this.baseUrl}${namespace}${url}`, {
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
