import { AuthorTitle } from '@angular-love/blog/contracts/authors';

export interface UiAuthorCard {
  name: string;
  avatarUrl: string;
  position: string;
  slug: string;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  description: string;
  titles: AuthorTitle[];
}
