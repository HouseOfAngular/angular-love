import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { ArticleSummaryResponse } from '@angular-love/blog/articles/data-access';

import { ArticleSummaryDialogComponent } from './article-summary-dialog.component';

@Injectable({ providedIn: 'root' })
export class ArticleSummaryDialogService {
  private readonly _dialog = inject(Dialog);
  private readonly _cache = new Map<string, ArticleSummaryResponse>();

  getCached(slug: string): ArticleSummaryResponse | undefined {
    return this._cache.get(slug);
  }

  setCached(slug: string, data: ArticleSummaryResponse): void {
    this._cache.set(slug, data);
  }

  open(slug: string): void {
    this._dialog.open(ArticleSummaryDialogComponent, {
      data: slug,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: false,
      backdropClass: 'al-dialog-backdrop',
      panelClass: ['w-full', 'max-w-2xl'],
    });
  }
}
