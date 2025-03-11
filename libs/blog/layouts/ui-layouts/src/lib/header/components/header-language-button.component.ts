import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { Lang } from '@angular-love/contracts/articles';

@Component({
  standalone: true,
  selector: 'al-header-language-button',
  template: `
    <button
      *transloco="let t; read: 'iconButtons'"
      [attr.data-testid]="vm().testId"
      type="button"
      class="border-al-gray-200 mr-1 rounded border bg-transparent px-1 py-2 font-medium leading-4 md:mr-2 md:px-4"
      [ngClass]="{
        '!text-white': selected(),
        '!text-al-gray-50  opacity-50': !selected(),
      }"
      [attr.aria-label]="t(vm().translationKey)"
      (click)="languageChange.emit()"
    >
      {{ vm().name }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslocoDirective],
})
export class HeaderLanguageButtonComponent {
  readonly lang = input.required<Lang>();
  readonly selected = input.required<boolean>();

  readonly languageChange = output<void>();

  readonly vm = computed(() => ({
    name: this.lang() === 'en' ? 'ENG' : 'PL',
    testId: `header-${this.lang()}-switch`,
    translationKey:
      this.lang() === 'en' ? `changeLangToEnglish` : 'changeLangToPolish',
  }));
}
