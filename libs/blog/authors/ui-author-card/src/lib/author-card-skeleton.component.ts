import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui-card';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-author-card-skeleton',
  standalone: true,
  imports: [
    CardSkeletonComponent,
    NgxSkeletonLoaderModule,
    AvatarComponent,
    SocialMediaIconsComponent,
  ],
  template: `
    <al-card-skeleton [withImage]="false">
      <div alCardContent>
        <div class="flex items-center gap-6">
          <!-- avatar -->
          <ngx-skeleton-loader
            [appearance]="'circle'"
            [theme]="{
              height: '60px',
              width: '60px',
              'margin-bottom': '10px'
            }"
          ></ngx-skeleton-loader>
          <div class="w-full">
            <!-- name -->
            <ngx-skeleton-loader
              [theme]="{ width: '100%', 'margin-bottom': '0', height: '15px' }"
              [count]="2"
            ></ngx-skeleton-loader>
          </div>
        </div>

        <!-- description -->
        <ngx-skeleton-loader
          [theme]="{ width: '100%', 'margin-bottom': '0', height: '15px' }"
          [count]="2"
        ></ngx-skeleton-loader>
      </div>
    </al-card-skeleton>
  `,
})
export class AuthorCardSkeletonComponent {}
