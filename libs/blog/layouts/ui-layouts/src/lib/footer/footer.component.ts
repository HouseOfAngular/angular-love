import { BreakpointObserver } from '@angular/cdk/layout';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import {
  NavigationComponent,
  NavItem,
} from '@angular-love/blog/layouts/ui-navigation';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';

import { FooterLogoComponent } from './components/footer-logo.component';
import { FooterSocialMediaIconsComponent } from './components/footer-social-media-icons.component';
import { hoaHireUs, partnersList } from './partners';

@Component({
  selector: 'al-footer',
  imports: [
    NavigationComponent,
    FooterLogoComponent,
    FooterSocialMediaIconsComponent,
    PartnersComponent,
    NgOptimizedImage,
    TranslocoDirective,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly theme = input.required<'light' | 'dark'>();
  readonly hoaLogoSrc = computed(() =>
    this.theme() === 'dark'
      ? 'assets/HOA_logo_white.png'
      : 'assets/HOA_logo_blue.png',
  );

  currentYear = new Date().getFullYear();
  readonly partnersList = partnersList;
  readonly hoaHireUs = hoaHireUs;

  private readonly _breakpointObserver = inject(BreakpointObserver);

  readonly isXlScreen = toSignal(
    this._breakpointObserver
      .observe('(min-width: 1280px)')
      .pipe(map(({ matches }) => matches)),
  );

  readonly navItems: NavItem[] = [
    {
      translationPath: 'nav.guides',
      link: ['guides'],
      dataTestId: 'navigation-guides',
    },
    {
      translationPath: 'nav.about',
      link: ['about-us'],
      dataTestId: 'navigation-about',
    },
    {
      translationPath: 'nav.news',
      link: ['news'],
      dataTestId: 'navigation-news',
    },
    {
      translationPath: 'nav.become_author',
      link: ['become-author'],
      dataTestId: 'navigation-become-author',
    },
    {
      translationPath: 'nav.meetups',
      link: ['https://meetup.angular.love/autumn-camp-2025/'],
      externalLink: true,
      dataTestId: 'navigation-meetups',
    },
    {
      translationPath: 'nav.newsletter',
      link: ['newsletter'],
      dataTestId: 'navigation-newsletter',
    },
    {
      translationPath: 'nav.in_depth',
      link: ['angular-in-depth'],
      dataTestId: 'navigation-in-depth',
    },
    {
      translationPath: 'nav.partnership',
      link: ['mailto:angular@angular.love'],
      externalLink: true,
      dataTestId: 'navigation-partnership',
    },
  ];
}
