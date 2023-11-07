import { inject, Injectable } from '@angular/core';
import {
  GetPostsGQL,
  LanguageCodeFilterEnum,
} from '@angular-love/wp/graphql/data-access';
import { map, Observable } from 'rxjs';
import { Article } from './article';
import { articlesMapper } from './article.mapper';

@Injectable()
export class ArticlesService {
  private readonly _getPosts = inject(GetPostsGQL);

  getArticlesList(limit: number): Observable<Article[]> {
    return this._getPosts
      .watch({
        languages: LanguageCodeFilterEnum.En,
        first: limit,
      })
      .valueChanges.pipe(map((resp) => articlesMapper(resp.data)));
  }
}
