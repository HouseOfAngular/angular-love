import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'al-presentation-card-skeleton',
  imports: [NgxSkeletonLoaderModule],
  template: `
    <div class="flex h-full flex-col">
      <!-- Featured image -->
      <ngx-skeleton-loader
        [theme]="{ width: '100%', height: '228px', borderRadius: '8px' }"
      />

      <div class="flex flex-col pt-8">
        <!-- Author info -->
        <div class="mb-3 flex items-center gap-2">
          <ngx-skeleton-loader
            [theme]="{ width: '32px', height: '32px', borderRadius: '50%' }"
          />
          <ngx-skeleton-loader [theme]="{ width: '120px', height: '14px' }" />
        </div>

        <!-- Title -->
        <ngx-skeleton-loader
          [theme]="{ width: '100%', height: '24px', marginBottom: '8px' }"
        />
        <ngx-skeleton-loader
          [theme]="{ width: '80%', height: '24px', marginBottom: '16px' }"
        />

        <!-- Excerpt -->
        <ngx-skeleton-loader
          [theme]="{ width: '100%', height: '16px', marginBottom: '4px' }"
        />
        <ngx-skeleton-loader
          [theme]="{ width: '90%', height: '16px', marginBottom: '16px' }"
        />

        <!-- Metadata -->
        <div class="flex items-center gap-2">
          <ngx-skeleton-loader
            [theme]="{ width: '80px', height: '20px', borderRadius: '4px' }"
          />
          <ngx-skeleton-loader [theme]="{ width: '100px', height: '14px' }" />
        </div>
      </div>
    </div>
  `,
})
export class PresentationCardSkeletonComponent {}
