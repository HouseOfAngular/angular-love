import { NewAuthor } from '@angular-love/blog-bff/shared/schema';
import { WPAuthorDto } from '@angular-love/util-wp';

export const toAuthor = (dto: WPAuthorDto): NewAuthor => {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    avatarUrl: dto.acf.acf_avatar,
    position: dto.acf.al_position,
    github: dto.acf.al_github_nickname || null,
    twitter: dto.acf.al_twitter_handle || null,
    linkedin: dto.acf.al_linkedin_id || null,
    titles: dto.acf.al_titles,
    descriptionEn: dto.acf.user_description_en,
    descriptionPl: dto.acf.user_description_pl,
  };
};
