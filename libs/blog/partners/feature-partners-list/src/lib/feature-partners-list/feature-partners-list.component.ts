import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type partnerData = {
  URL: string;
  alt: string;
};
@Component({
  selector: 'al-feature-partners-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-partners-list.component.html',
  styleUrls: ['./feature-partners-list.component.scss'],
})
export class FeaturePartnersListComponent {
  protected readonly partnersList: partnerData[] = [
    {
      URL: 'assets/frontend-united.png',
      alt: 'frontend united',
    },
    {
      URL: 'assets/angular-js.png',
      alt: 'angular-js',
    },
    {
      URL: 'assets/angular-community.png',
      alt: 'angular-community',
    },
    {
      URL: 'assets/GDG-cloud.png',
      alt: 'GDG-cloud',
    },
    {
      URL: 'assets/front-end.png',
      alt: 'front-end',
    },
  ];
}
