import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { Lang } from '@angular-love/shared/utils-i18n';

@Component({
  standalone: true,
  selector: 'al-language-picker',
  template: `
    <div class="mr-3">
      <div class="flex h-full items-center text-sm">
        <label
          class="relative block text-gray-400 focus-within:text-gray-600"
          for="language"
        >
          <span class="sr-only">Select language</span>
          <fast-svg
            name="translate"
            class="text-al-primary pointer-events-none absolute left-2 top-1/2 !block -translate-y-1/2"
            size="20"
          />

          <select
            id="language"
            #selectLang
            class="bg-al-background w-full rounded-md py-1 pl-8"
            (change)="languageChange.emit(selectLang.value)"
          >
            @for (lang of availableLangs; track $index) {
              <option
                [selected]="lang.value === language()"
                [value]="lang.value"
              >
                {{ lang.display }}
              </option>
            }
          </select>
        </label>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent],
})
export class LanguagePickerComponent {
  readonly language = input.required<string>();
  readonly availableLanguages: Lang[] = ['en', 'pl'];
  readonly availableLangs = [
    { value: 'pl', display: 'Polish' },
    { value: 'en', display: 'English' },
  ];
  readonly languageChange = output<string>();
}
