import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import {
  CardComponent,
  CardContentDirective,
} from '@angular-love/blog/shared/ui-card';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-article-content-skeleton',
  standalone: true,
  template: `
    <al-card>
      <article alCardContent>
        <div *alRepeat="5" class="mt-8">
          <ngx-skeleton-loader
            [theme]="{ width: '100%', 'margin-bottom': '4px', height: '15px' }"
            [count]="15"
          ></ngx-skeleton-loader>

          <ngx-skeleton-loader
            [theme]="{
              width: '100%',
              'margin-bottom': '20px',
              height: '200px',
              'margin-top': '30px'
            }"
            [count]="1"
          ></ngx-skeleton-loader>
        </div>
      </article>
    </al-card>
  `,
  imports: [
    CardComponent,
    CardContentDirective,
    NgxSkeletonLoaderModule,
    RepeatDirective,
  ],
})
export class ArticleContentSkeletonComponent {}
