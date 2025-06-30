import { BaseNodeDTO } from './base-node.type';
import { ContentSlug } from './content-slug.type';

export interface RegularNodeDTO extends BaseNodeDTO {
  nodeType: 'regular';
  articles: ContentSlug[];
  movies: ContentSlug[];
}
