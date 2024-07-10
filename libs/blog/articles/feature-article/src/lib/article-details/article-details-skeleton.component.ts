import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ArticleContentSkeletonComponent } from '@angular-love/blog/articles/ui-article-content';
import { AuthorCardSkeletonComponent } from '@angular-love/blog/authors/ui-author-card';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-article-details-skeleton',
  standalone: true,
  imports: [
    CardSkeletonComponent,
    NgxSkeletonLoaderModule,
    ArticleContentSkeletonComponent,
    AuthorCardSkeletonComponent,
  ],
  template: `
    <div class="grid w-full grid-cols-12 gap-y-10 lg:gap-x-10">
      <section class="col-span-12 lg:col-span-8">
        <div>
          <div class="mb-4 flex justify-between">
            <!-- date -->
            <span class="w-1/4">
              <ngx-skeleton-loader
                [theme]="{
                  height: '20px',
                }"
              ></ngx-skeleton-loader>
            </span>

            <!-- read time -->
            <span class="w-1/4">
              <ngx-skeleton-loader
                [theme]="{
                  height: '20px',
                }"
              ></ngx-skeleton-loader>
            </span>
          </div>
        </div>

        <h1 class="mb-4 w-3/4 text-4xl">
          <!-- title -->
          <ngx-skeleton-loader
            [theme]="{
              height: '40px',
            }"
          ></ngx-skeleton-loader>
        </h1>

        <al-article-content-skeleton />
      </section>

      <aside class="col-span-12 lg:col-span-4">
        <al-author-card-skeleton />
        <!-- table-of-contents -->
        <div
          class="!mt-4 hidden h-[344px] flex-col items-start justify-between rounded-lg border lg:flex"
        >
          <ngx-skeleton-loader
            class="w-1/4"
            [theme]="{
              'margin-left': '40px',
              'margin-top': '40px',
              height: '24px',
            }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            class="w-3/4"
            [theme]="{
              'margin-left': '40px',
              'margin-bottom': '40px',
              height: '200px',
            }"
          ></ngx-skeleton-loader>
        </div>
        <!-- share article section -->
        <div
          class="!mt-4 hidden h-[138px] flex-row items-center justify-between rounded-lg border lg:flex"
        >
          <div class="ml-10 flex h-10 w-[100px] ">
            <ngx-skeleton-loader
              class="w-full"
              [theme]="{
                height: '40px',
                width: '100%',
              }"
            ></ngx-skeleton-loader>
          </div>

          <div class="mr-10 flex h-10 w-[140px] items-start justify-between">
            @for (i of [0, 1, 2]; track $index) {
              <ngx-skeleton-loader
                [appearance]="'circle'"
                [theme]="{
                  height: '28px',
                  width: '28px',
                }"
              ></ngx-skeleton-loader>
            }
          </div>
        </div>
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class ArticleDetailsSkeletonComponent {}
