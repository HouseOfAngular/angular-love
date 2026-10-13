import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'al-news-card-skeleton',
  imports: [NgxSkeletonLoaderModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <div
      class="bg-al-card dark:border-al-border flex h-full w-full flex-col gap-1 rounded-lg border p-4"
    >
      <ngx-skeleton-loader [theme]="{ width: '25%', height: '14px' }" />
      <ngx-skeleton-loader [theme]="{ width: '100%', height: '22px' }" />
      <ngx-skeleton-loader
        [theme]="{ width: '100%', height: '14px', margin: '0' }"
        count="3"
      />
      <ngx-skeleton-loader
        [theme]="{ width: '60%', height: '14px', margin: '12px 0 0' }"
      />
    </div>
  `,
})
export class NewsCardSkeletonComponent {}
