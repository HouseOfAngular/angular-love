import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { CardComponent } from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-article-compact-card-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, CardComponent],
  template: `
    <al-card class="h-full">
      <div alCardContent class="flex flex-col">
        <div class="flex flex-row items-center">
          <!-- avatar -->
          <ngx-skeleton-loader
            class="block h-8"
            [appearance]="'circle'"
            [theme]="{
              height: '32px',
              width: '32px',
              margin: '0'
            }"
          />
          <!-- name -->
          <ngx-skeleton-loader
            class="ml-2 block h-4 w-[120px]"
            [theme]="{ width: '100%', margin: '0', height: '16px' }"
          />
          <!-- time -->
          <ngx-skeleton-loader
            class="ml-auto block h-4 w-[30px]"
            [theme]="{ width: '100%', margin: '0', height: '16px' }"
          />
        </div>

        <div class="pt-8">
          <!-- article title -->
          <ngx-skeleton-loader [theme]="{ width: '100%', height: '36px' }" />
          <!-- article excerpt -->
          <ngx-skeleton-loader
            class="h-4 w-full"
            [theme]="{ width: '100%', margin: '0', height: '16px' }"
          />
          <ngx-skeleton-loader
            class="mt-1 h-4"
            [theme]="{ width: '69%', margin: '0', height: '16px' }"
          />
        </div>
      </div>
    </al-card>
  `,
})
export class ArticleCompactCardSkeletonComponent {}
