import { Page } from '@angular-love/blog/contracts/pages';

import { WPPageDto } from './dtos';

export const toPageList = (dto: WPPageDto[]): Page[] => {
  return (dto || []).map((dto) => {
    return {
      slug: dto.slug,
      title: dto.title.rendered,
      content: dto.content.rendered,
      excerpt: dto.excerpt.rendered,
      otherTranslations: dto.other_translations || [],
      lang: dto.lang,
    };
  });
};

export const toPage = (dto: WPPageDto): Page => {
  return {
    slug: dto.slug,
    title: dto.title.rendered,
    content: dto.content.rendered,
    excerpt: dto.excerpt.rendered,
    otherTranslations: dto.other_translations || [],
    lang: dto.lang,
  };
};
