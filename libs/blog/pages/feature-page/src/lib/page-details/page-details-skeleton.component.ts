import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-page-details-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule, RepeatDirective],
  template: `
    <div class="grid-cols-15 grid w-full gap-y-10 lg:gap-x-10">
      <section class="col-span-12 lg:col-span-8">
        <h1 class="mb-4 w-1/2 text-4xl">
          <ngx-skeleton-loader
            [theme]="{
              height: '40px',
              'margin-top': '4px',
            }"
          ></ngx-skeleton-loader>
        </h1>
        <article>
          <div *alRepeat="5">
            <ngx-skeleton-loader
              [theme]="{
                width: '100%',
                'margin-bottom': '4px',
                height: '15px',
              }"
              [count]="5"
            />
          </div>
        </article>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsSkeletonComponent {}
