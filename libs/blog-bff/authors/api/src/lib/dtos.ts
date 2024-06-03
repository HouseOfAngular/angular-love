export interface WPAuthorDto {
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
  description: string;
  acf: {
    al_position: string;
    al_github_nickname: string;
    al_twitter_handle: string;
    al_linkedin_id: string;
  };
}
