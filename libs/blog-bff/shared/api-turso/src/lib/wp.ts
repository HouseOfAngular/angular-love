import {
  WPAuthorDto,
  WPPostDetailsDto,
  WPRestClient,
} from '@angular-love/util-wp';

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

  return {
    post: (id: number) =>
      wp.get<WPPostDetailsDto>(`posts/${id}`, {
        acf_format: 'standard',
      }),
    author: (id: number) =>
      wp.get<WPAuthorDto>(`users/${id}`, { acf_format: 'standard' }),
  };
}
