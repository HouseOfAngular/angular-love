import { BaseNode } from './base-node.type';
import { ContentSlug } from './content-slug.type';

export type RegularNode = BaseNode & {
  articles: ContentSlug[];
  movies: ContentSlug[];
};
