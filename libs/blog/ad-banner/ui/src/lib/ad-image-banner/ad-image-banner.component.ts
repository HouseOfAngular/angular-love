import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { AdImageBanner } from './ad-image-banner-data.interface';

@Component({
  selector: 'al-ad-image-banner',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './ad-image-banner.component.html',
})
export class AdImageBannerComponent {
  banner = input.required<AdImageBanner>();

  private readonly _router = inject(Router);
  private readonly _localizeService = inject(AlLocalizeService);

  navigateFromBanner(): void {
    this._router.navigate(
      this._localizeService.localizePath(['/', this.banner()!.slug]),
    );
  }
}
