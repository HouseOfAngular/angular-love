export type AuthorTitle =
  | 'gde'
  | 'hoa'
  | 'contributor'
  | 'key_contributor'
  | 'blogger';

export interface Author {
  slug: string;
  name: string;
  avatarUrl: string;
  description: {
    pl: string;
    en: string;
  };
  position: string;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  titles: AuthorTitle[];
}
