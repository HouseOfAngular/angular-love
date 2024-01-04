import { Component } from '@angular/core';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AuthorCardSkeletonComponent } from '@angular-love/blog/authors/ui-card';
import { ArticleContentComponent } from './article-content/article-content-skeleton.component';

@Component({
  selector: 'al-blog-articles-feature-item-skeleton',
  standalone: true,
  imports: [
    CardSkeletonComponent,
    NgxSkeletonLoaderModule,
    AuthorCardSkeletonComponent,
    ArticleContentComponent,
  ],
  template: `
    <section class="block w-full py-8">
      <h1 class="text-4xl justify-center flex">
        <!-- title -->
        <ngx-skeleton-loader
          [theme]="{ width: '600px', 'margin-bottom': '0', height: '40px' }"
          [count]="1"
        ></ngx-skeleton-loader>
      </h1>
      <span class="justify-center flex">
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
})
export class BlogArticlesFeatureItemSkeletonComponent {}
