import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AuthorCardTemplateComponent } from './author-card-template.component';

@Component({
  selector: 'al-author-card-skeleton',
  imports: [AuthorCardTemplateComponent, NgxSkeletonLoaderModule],
  template: `
    <al-author-card-template>
      <ng-container author-info-card>
        <!-- avatar -->
        <ngx-skeleton-loader
          class="block h-[96px] w-[96px]"
          [appearance]="'circle'"
          [theme]="{
            height: '96px',
            width: '96px',
            margin: '0',
          }"
        />

        <!-- name -->
        <ngx-skeleton-loader
          class="block h-4 w-[120px]"
          [theme]="{ width: '100%', margin: '0', height: '16px' }"
        />

        <!-- position -->
        <ngx-skeleton-loader
          class="block h-3.5 w-[160px]"
          [theme]="{ width: '100%', margin: '0', height: '14px' }"
        />
      </ng-container>

      <ng-container author-info-description>
        <ngx-skeleton-loader
          [theme]="{ width: '100%', 'margin-bottom': '0', height: '14px' }"
          [count]="2"
        />
        <ngx-skeleton-loader
          class="my-8 block"
          [theme]="{ width: '100%', 'margin-bottom': '0', height: '14px' }"
          [count]="3"
        />
        <ngx-skeleton-loader
          [theme]="{ width: '100%', 'margin-bottom': '0', height: '14px' }"
          [count]="1"
        />
      </ng-container>
    </al-author-card-template>
  `,
})
export class AuthorCardSkeletonComponent {}
