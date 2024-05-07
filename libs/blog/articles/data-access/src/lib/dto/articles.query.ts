import { ArticleCategory } from '@angular-love/contracts/articles';

export type ArticlesQuery = {
  authorSlug?: string;
  take?: number;
  skip?: number;
  category?: ArticleCategory;
} | null;
