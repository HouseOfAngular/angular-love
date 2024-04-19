import { ChangeDetectionStrategy, Component } from '@angular/core';

export type PartnerData = {
  URL: string;
  alt: string;
};

@Component({
  selector: 'al-partners-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partners-list.component.html',
  styleUrl: './partners-list.component.scss',
})
export class PartnersListComponent {
  protected readonly partnersList: PartnerData[] = [
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
