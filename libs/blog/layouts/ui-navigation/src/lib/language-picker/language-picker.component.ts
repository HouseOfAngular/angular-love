import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { Lang } from '@angular-love/contracts/articles';

@Component({
  standalone: true,
  selector: 'al-language-picker',
  template: `
    <div class="flex h-full items-center text-sm">
      <label
        class="text-al-primary-foreground relative block focus-within:text-gray-600"
        for="language-picker"
      >
        <span class="sr-only">
          {{ baseTranslationPath + '.select_lang' | transloco }}
        </span>
        <fast-svg
          name="translate"
          aria-hidden="true"
          class="text-al-primary pointer-events-none absolute top-1/2 left-0 block! -translate-y-1/2"
          size="20"
        />

        <select
          id="language-picker"
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
          aria-hidden="true"
          class="pointer-events-none absolute top-1/2 right-0 block! -translate-y-1/2"
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

  readonly baseTranslationPath = 'nav.languagePicker';

  readonly availableLangs = [
    { value: 'en', translationPath: `${this.baseTranslationPath}.en` },
    { value: 'pl', translationPath: `${this.baseTranslationPath}.pl` },
  ] satisfies { value: Lang; translationPath: string }[];
}
