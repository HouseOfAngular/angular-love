import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'al-video-card-skeleton',
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div class="flex flex-col">
      <ngx-skeleton-loader [theme]="{ width: '100%', height: '228px' }" />

      <div class="flex flex-col pt-6">
        <!-- video title -->
        <ngx-skeleton-loader [theme]="{ width: '100%', height: '24px' }" />
        <!-- event name -->
        <ngx-skeleton-loader
          class="h-4 w-full"
          [theme]="{ width: '100%', margin: '0', height: '18px' }"
        />
      </div>
    </div>
  `,
})
export class VideoCardSkeletonComponent {}
