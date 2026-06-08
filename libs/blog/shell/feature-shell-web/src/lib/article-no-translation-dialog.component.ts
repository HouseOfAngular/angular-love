import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

export interface ArticleNoTranslationDialogData {
  targetLang: string;
  targetLangName: string;
}

export type ArticleNoTranslationDialogResult = 'home' | null;

@Component({
  selector: 'al-article-no-translation-dialog',
  imports: [TranslocoDirective, ButtonComponent],
  template: `
    <div
      *transloco="let t; read: 'nav.languagePicker.noTranslationDialog'"
      class="bg-al-background flex max-w-md flex-col gap-6 rounded-xl p-8 shadow-xl"
    >
      <h2 class="text-xl font-bold">{{ t('title') }}</h2>
      <p class="text-al-muted-foreground">
        {{ t('description', { lang: data.targetLangName }) }}
      </p>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button al-button (click)="close(null)" variant="Secondary">
          {{ t('stayButton') }}
        </button>
        <button al-button (click)="close('home')">
          {{ t('goHomeButton') }}
        </button>
      </div>
    </div>
  `,
})
export class ArticleNoTranslationDialogComponent {
  protected readonly data = inject<ArticleNoTranslationDialogData>(DIALOG_DATA);

  private readonly _dialogRef =
    inject<DialogRef<ArticleNoTranslationDialogResult>>(DialogRef);

  close(result: ArticleNoTranslationDialogResult): void {
    this._dialogRef.close(result);
  }
}
