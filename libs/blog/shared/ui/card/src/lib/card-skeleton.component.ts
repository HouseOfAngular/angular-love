import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  standalone: true,
  selector: 'al-card-skeleton',
  template: `
    <div *ngIf="withImage">
      <div class="aspect-video">
        <ngx-skeleton-loader
          class="h-full w-full"
          [theme]="{
            'margin-bottom': '0',
            height: '100%'
          }"
        ></ngx-skeleton-loader>
      </div>
    </div>
    <div class="p-4">
      <ng-content select="[alCardHeader]"></ng-content>
      <ng-content select="[alCardContent]"></ng-content>
      <ng-content select="[alCardFooter]"></ng-content>
    </div>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgxSkeletonLoaderModule],
})
export class CardSkeletonComponent {
  @Input() withImage = true;

  @HostBinding('class')
  hostClasses = 'block bg-white rounded-lg shadow-sm overflow-hidden';
}
