import { Author } from '@angular-love/blog/contracts/authors';
import { Lang } from '@angular-love/shared/utils-i18n';

import { WPAuthorDto } from './dtos';

export const toAuthor = (dto: WPAuthorDto, lang: Lang): Author => {
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
