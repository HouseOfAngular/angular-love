export type WPRespone<T> = {
  data: T;
  headers: Headers;
};

export abstract class WPRestClient {
  abstract get<T>(
    url: string,
    params: Record<string, string>,
  ): Promise<WPRespone<T>>;
}
