import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { Partner } from '@angular-love/blog/shared/types';

@Component({
  selector: 'al-main-partner',
  standalone: true,
  imports: [CommonModule, TranslocoDirective, NgOptimizedImage],
  templateUrl: './ui-main-partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMainPartnerComponent {
  private readonly _hoaIconHireUs: Partner = {
    alt: 'Hire Us!',
    link_URL: 'https://houseofangular.io/',
    asset_URL: 'assets/HOA-hire-us.png',
  };
  private readonly _hoaIconHiring: Partner = {
    alt: 'Zatrudniamy',
    link_URL: 'https://houseofangular.io/career/',
    asset_URL: 'assets/HOA-hiring.png',
  };

  private readonly _translocoService = inject(TranslocoService);

  protected readonly lang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  protected readonly hoaIcon = computed(() => {
    if (this.lang() === 'en') return this._hoaIconHireUs;
    else return this._hoaIconHiring;
  });
}
