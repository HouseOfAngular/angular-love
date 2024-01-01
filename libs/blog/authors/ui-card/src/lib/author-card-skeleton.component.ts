import { Component } from '@angular/core';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';

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
    <angular-love-card-skeleton [withImage]="false">
      <div angularLoveCardContent>
        <div class="flex gap-6 items-center">
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
    </angular-love-card-skeleton>
  `,
})
export class AuthorCardSkeletonComponent {}
