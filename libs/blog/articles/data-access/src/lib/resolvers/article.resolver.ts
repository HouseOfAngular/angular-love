import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticlePreview } from '../infrastructure/article';
import { ArticlesService } from '../infrastructure/articles.service';

export const articleResolver: ResolveFn<Observable<ArticlePreview>> = (
  route: ActivatedRouteSnapshot
) => {
  const slug = route.paramMap.get('slug');
  return inject(ArticlesService).getArticleBySlug(slug!);
};
