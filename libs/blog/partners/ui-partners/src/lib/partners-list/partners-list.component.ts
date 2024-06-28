import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Partner } from '@angular-love/blog/shared/types';

@Component({
  selector: 'al-partners-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partners-list.component.html',
  imports: [NgOptimizedImage],
})
export class PartnersListComponent {
  protected readonly partnersList: Partner[] = [
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
  ];
}
