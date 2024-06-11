import { Author } from '@angular-love/blog/contracts/authors';
import { WPLang } from '@angular-love/util-wp';

import { WPAuthorDto } from './dtos';

export const toAuthor = (dto: WPAuthorDto, lang: WPLang): Author => {
  return {
    slug: dto.slug,
    name: dto.name,
    description:
      lang === 'pl' ? dto.acf.user_description_pl : dto.acf.user_description_en,
    avatarUrl:
      Object.entries(dto.avatar_urls).find(([, url]) =>
        url.includes('96'),
      )?.[1] || Object.values(dto.avatar_urls)[0],
    position: dto.acf.al_position,
    github: dto.acf.al_github_nickname || null,
    twitter: dto.acf.al_twitter_handle || null,
    linkedin: dto.acf.al_linkedin_id || null,
  };
};
