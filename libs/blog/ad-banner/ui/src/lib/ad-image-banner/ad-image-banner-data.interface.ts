export interface AdImageBanner {
  url: string;
  alt: string;
  action: { type: 'slug'; slug: string } | { type: 'url'; url: string };
}
