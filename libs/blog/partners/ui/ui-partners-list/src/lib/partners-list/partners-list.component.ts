import { ChangeDetectionStrategy, Component } from '@angular/core';

export type PartnerData = {
  asset_URL: string;
  alt: string;
  link_URL: string;
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
      asset_URL: 'assets/frontend-united.png',
      alt: 'frontend united',
      link_URL: '',
    },
    {
      asset_URL: 'assets/angular-js.png',
      alt: 'angular-js',
      link_URL: 'https://ng-poland.pl/',
    },
    {
      asset_URL: 'assets/angular-community.png',
      alt: 'angular-community',
      link_URL: 'https://angularcommunity.net/',
    },
    {
      asset_URL: 'assets/GDG-cloud.png',
      alt: 'GDG-cloud',
      link_URL: 'https://warsaw.devfest.pl/',
    },
    {
      asset_URL: 'assets/front-end.png',
      alt: 'front-end',
      link_URL: '',
    },
  ];

  protected visitPage(url: string) {
    if (url.length < 1) return;
    window.open(url, '_blank');
  }
}
