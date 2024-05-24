import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ArticleContentSkeletonComponent } from '@angular-love/blog/articles/ui-article-content';
import { AuthorCardSkeletonComponent } from '@angular-love/blog/authors/ui-author-card';
import { AuthorInfoSkeletonComponent } from '@angular-love/blog/authors/ui-author-info';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-article-details-skeleton',
  standalone: true,
  imports: [
    CardSkeletonComponent,
    NgxSkeletonLoaderModule,
    ArticleContentSkeletonComponent,
    AuthorCardSkeletonComponent,
    AuthorInfoSkeletonComponent,
  ],
  template: `
    <section class="block w-full py-8">
      <h1 class="flex justify-center text-4xl">
        <!-- title -->
        <ngx-skeleton-loader
          [theme]="{ width: '600px', 'margin-bottom': '0', height: '40px' }"
          [count]="1"
        ></ngx-skeleton-loader>
      </h1>
      <span class="flex justify-center">
        <!-- date -->
        <ngx-skeleton-loader
          [theme]="{ width: '200px', 'margin-bottom': '0', height: '15px' }"
          [count]="1"
        ></ngx-skeleton-loader>
      </span>
    </section>

    <div class="grid grid-cols-3 gap-10">
      <!-- content -->
      <section class="col-span-2">
        <al-article-content-skeleton />
      </section>

      <aside class="col-span-1">
        <!-- author -->
        <al-author-card-skeleton />
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class ArticleDetailsSkeletonComponent {}
