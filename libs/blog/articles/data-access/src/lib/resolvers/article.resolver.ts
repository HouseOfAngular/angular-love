import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticlesService } from '../articles.service';
import { ArticlePreview } from '../article';

export const articleResolver: ResolveFn<Observable<ArticlePreview>> = (
  route: ActivatedRouteSnapshot
) => {
  const slug = route.paramMap.get('slug');
  return inject(ArticlesService).getArticleBySlug(slug!);
};
