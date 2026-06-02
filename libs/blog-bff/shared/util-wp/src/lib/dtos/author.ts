export interface WPAuthorDto {
  id: number;
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
  description: string;
  acf: {
    al_position: string;
    acf_avatar: string;
    al_github_nickname: string;
    al_twitter_handle: string;
    al_linkedin_id: string;
    al_titles: (
      | 'gde'
      | 'hoa'
      | 'contributor'
      | 'key_contributor'
      | 'blogger'
    )[];
    user_description_pl: string;
    user_description_en: string;
  };
}
