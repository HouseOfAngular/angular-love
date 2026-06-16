import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'al-video-card-skeleton',
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div
      class="bg-al-card h-full w-full rounded-lg border shadow-none dark:border-transparent"
    >
      <div class="overflow-hidden rounded-t-lg">
        <ngx-skeleton-loader
          [theme]="{ width: '100%', margin: '0', height: '228px' }"
        />
      </div>

      <div class="flex flex-col px-4 pt-4 pb-4">
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
