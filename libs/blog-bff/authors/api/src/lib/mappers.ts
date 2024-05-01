import { Author } from '@angular-love/blog/contracts/authors';

import { WPAuthorDto } from './dtos';

export const toAuthor = (dto: WPAuthorDto): Author => {
  return {
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    avatarUrl:
      Object.entries(dto.avatar_urls).find(([, url]) =>
        url.includes('96'),
      )?.[1] || Object.values(dto.avatar_urls)[0],
    position: 'to do add position',
  };
};
