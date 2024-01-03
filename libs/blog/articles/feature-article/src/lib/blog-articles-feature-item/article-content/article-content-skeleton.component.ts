import { Component } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
} from '@angular-love/blog/shared/ui/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-article-content-skeleton',
  standalone: true,
  template: `
    <angular-love-card>
      <article angularLoveCardContent>
        <div *angularLoveRepeat="5" class="mt-8">
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
    </angular-love-card>
  `,
  imports: [
    CardComponent,
    CardContentDirective,
    NgxSkeletonLoaderModule,
    RepeatDirective,
  ],
})
export class ArticleContentComponent {}
