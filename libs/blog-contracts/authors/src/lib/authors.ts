export interface Author {
  slug: string;
  name: string;
  avatarUrl: string;
  description: string;
  position: string;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  acf: {
    user_description_pl: string;
    user_description_en: string;
  };
}
