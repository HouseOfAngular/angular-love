import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { Lang } from '@angular-love/contracts/articles';

import { HeaderLanguageButtonComponent } from './header-language-button.component';

@Component({
  standalone: true,
  selector: 'al-header-language',
  template: `
    <div
      *transloco="let t; read: 'iconButtons'"
      class="ml-6 flex max-w-20 flex-row md:max-w-[200px]"
    >
      @for (lang of availableLanguages; track $index) {
        <al-header-language-button
          [lang]="lang"
          [selected]="language() === lang"
          (languageChange)="languageChange.emit(lang)"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgClass, HeaderLanguageButtonComponent],
})
export class HeaderLanguageComponent {
  readonly language = input.required<string>();
  readonly availableLanguages: Lang[] = ['en', 'pl'];

  readonly languageChange = output<string>();
}
