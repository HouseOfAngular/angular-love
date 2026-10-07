import {
  WPAuthorDto,
  WPPostDetailsDto,
  WPRestClient,
} from '@angular-love/util-wp';

export type WpResource = ReturnType<typeof getWpResource>;

export function getWpResource({
  baseUrl,
  apiToken,
}: {
  baseUrl: string;
  apiToken: string;
}) {
  const wp = new WPRestClient(baseUrl, {
    headers: {
      Authorization: apiToken,
    },
  });

  /** Pages through a list endpoint and collects every id. */
  const listIds = async (resource: string): Promise<number[]> => {
    const ids: number[] = [];
    let totalPages = 1;
    for (let page = 1; page <= totalPages; page++) {
      const { data, headers } = await wp.get<{ id: number }[]>(resource, {
        per_page: '100',
        page: String(page),
        _fields: 'id,type',
      });
      ids.push(...data.map((item) => item.id));
      totalPages = Number(headers.get('x-wp-totalpages') ?? 1);
    }
    return ids;
  };

  return {
    post: (id: number) =>
      wp.get<WPPostDetailsDto>(`posts/${id}`, {
        acf_format: 'standard',
      }),
    author: (id: number) =>
      wp.get<WPAuthorDto>(`users/${id}`, { acf_format: 'standard' }),
    postIds: () => listIds('posts'),
    authorIds: () => listIds('users'),
  };
}
