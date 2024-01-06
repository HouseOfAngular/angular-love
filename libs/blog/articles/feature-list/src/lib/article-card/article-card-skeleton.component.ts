import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardSkeletonComponent } from '@angular-love/blog/shared/ui/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'al-article-card-skeleton',
  template: `
    <al-card-skeleton>
      <div alCardHeader>
        <ngx-skeleton-loader
          [theme]="{ 'margin-bottom': '12px' }"
        ></ngx-skeleton-loader>
      </div>
      <div alCardContent>
        <ngx-skeleton-loader
          [theme]="{ width: '100%', 'margin-bottom': '0', height: '15px' }"
          [count]="5"
        ></ngx-skeleton-loader>
      </div>
      <div alCardFooter>
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-2">
            <ngx-skeleton-loader
              [appearance]="'circle'"
              [theme]="{
                height: '30px',
                width: '30px',
                'margin-bottom': '0px'
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{ width: '120px', margin: '0px' }"
            ></ngx-skeleton-loader>
          </div>
          <ngx-skeleton-loader
            [theme]="{ width: '60px', 'margin-bottom': '0px' }"
          ></ngx-skeleton-loader>
        </div>
      </div>
    </al-card-skeleton>
  `,
  styleUrls: ['./article-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardSkeletonComponent,
    NgxSkeletonLoaderModule,
    AvatarComponent,
    DatePipe,
  ],
})
export class ArticleCardSkeletonComponent {}
