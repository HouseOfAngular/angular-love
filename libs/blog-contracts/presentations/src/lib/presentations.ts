import { ArticlePreview } from '@angular-love/contracts/articles';

export type PresentationPreview = Omit<
  ArticlePreview,
  'readingTime' | 'difficulty'
> & {
  eventName: string;
  presentationUrl: string;
};
