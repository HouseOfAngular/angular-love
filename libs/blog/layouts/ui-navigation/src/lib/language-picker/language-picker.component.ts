import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { Lang } from '@angular-love/shared/utils-i18n';

@Component({
  standalone: true,
  selector: 'al-language-picker',
  template: `
    <div class="flex h-full items-center text-sm">
      <label
        class="relative block text-gray-400 focus-within:text-gray-600"
        for="language"
      >
        <span class="sr-only">Select language</span>
        <fast-svg
          name="translate"
          class="text-al-primary pointer-events-none absolute left-0 top-1/2 !block -translate-y-1/2"
          size="20"
        />

        <select
          id="language"
          #selectLang
          class="bg-al-background appearance-none rounded-md px-8 py-1"
          (change)="languageChange.emit(selectLang.value)"
        >
          @for (lang of availableLangs; track $index) {
            <option [selected]="lang.value === language()" [value]="lang.value">
              {{ lang.translationPath | transloco }}
            </option>
          }
        </select>

        <fast-svg
          name="arrow-down"
          class="pointer-events-none absolute right-0 top-1/2 !block -translate-y-1/2"
          size="20"
        />
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent, TranslocoPipe],
})
export class LanguagePickerComponent {
  readonly language = input.required<string>();

  readonly languageChange = output<string>();

  readonly availableLangs = [
    { value: 'pl', translationPath: 'nav.languagePicker.pl' },
    { value: 'en', translationPath: 'nav.languagePicker.en' },
  ] satisfies { value: Lang; translationPath: string }[];
}
