export interface SchemaRef {
  '@id': string;
}

export interface SchemaImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
}

export interface SchemaSearchAction {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export interface SchemaOrganization {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo: SchemaImageObject;
  sameAs: string[];
}

export interface SchemaWebSite {
  '@type': 'WebSite';
  '@id': string;
  url: string;
  name: string;
  inLanguage: string[];
  publisher: SchemaRef;
  potentialAction?: SchemaSearchAction;
}

export interface SchemaBlogPosting {
  '@type': 'BlogPosting';
  '@id': string;
  headline: string;
  description?: string;
  image?: SchemaImageObject;
  datePublished?: string;
  dateModified?: string;
  inLanguage: string;
  url: string;
  mainEntityOfPage: SchemaRef;
  author: SchemaRef;
  publisher: SchemaRef;
}

export interface SchemaPerson {
  '@type': 'Person';
  '@id': string;
  name: string;
  url: string;
  sameAs?: string[];
}

export interface SchemaListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface SchemaBreadcrumbList {
  '@type': 'BreadcrumbList';
  '@id': string;
  itemListElement: SchemaListItem[];
}

export type WebPageType =
  | 'WebPage'
  | 'AboutPage'
  | 'CollectionPage'
  | 'ProfilePage';

const WEB_PAGE_TYPES: readonly string[] = [
  'WebPage',
  'AboutPage',
  'CollectionPage',
  'ProfilePage',
];

export function isWebPageType(value: string): value is WebPageType {
  return WEB_PAGE_TYPES.includes(value);
}

export interface SchemaWebPage {
  '@type': WebPageType;
  '@id': string;
  url: string;
  name: string;
  description?: string;
  inLanguage: string;
  isPartOf: SchemaRef;
  mainEntity?: SchemaRef;
  about?: SchemaRef;
  breadcrumb?: SchemaRef;
}

export type SchemaGraphEntity =
  | SchemaOrganization
  | SchemaWebSite
  | SchemaBlogPosting
  | SchemaPerson
  | SchemaBreadcrumbList
  | SchemaWebPage;
