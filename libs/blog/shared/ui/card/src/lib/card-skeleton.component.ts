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
  selector: 'angular-love-card-skeleton',
  template: `
    <div *ngIf="withImage">
      <div class="aspect-video">
        <ngx-skeleton-loader
          class="w-full h-full"
          [theme]="{
            'margin-bottom': '0',
            height: '100%'
          }"
        ></ngx-skeleton-loader>
      </div>
    </div>
    <div class="p-4">
      <ng-content select="[angularLoveCardHeader]"></ng-content>
      <ng-content select="[angularLoveCardContent]"></ng-content>
      <ng-content select="[angularLoveCardFooter]"></ng-content>
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
