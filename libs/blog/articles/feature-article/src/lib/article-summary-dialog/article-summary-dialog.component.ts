import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { of, tap } from 'rxjs';

import {
  ArticlesService,
  PersonaId,
} from '@angular-love/blog/articles/data-access';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { DialogShellComponent } from '@angular-love/blog/shared/ui-dialog';

import { ArticleSummaryDialogService } from './article-summary-dialog.service';

const PERSONA_IMAGE_MAP: Record<PersonaId, string> = {
  coach: '/assets/Subject.webp',
  takeaways: '/assets/Subject2.webp',
  mentor: '/assets/Subject3.webp',
  hotTake: '/assets/Subject4.webp',
};

@Component({
  selector: 'al-article-summary-dialog',
  templateUrl: './article-summary-dialog.component.html',
  styleUrl: './article-summary-dialog.component.scss',
  imports: [NgxSkeletonLoaderModule, ButtonComponent, DialogShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSummaryDialogComponent {
  private readonly _dialogRef = inject(DialogRef<void>);
  private readonly _slug = inject<string>(DIALOG_DATA);
  private readonly _articlesService = inject(ArticlesService);
  private readonly _summaryDialogService = inject(ArticleSummaryDialogService);

  protected readonly personaImageMap = PERSONA_IMAGE_MAP;

  readonly summaryResource = rxResource({
    params: () => this._slug,
    stream: ({ params: slug }) => {
      const cached = this._summaryDialogService.getCached(slug);
      if (cached) return of(cached);
      return this._articlesService
        .getSummary(slug)
        .pipe(tap((data) => this._summaryDialogService.setCached(slug, data)));
    },
  });

  private readonly _selectedPersonaId = signal<PersonaId | null>(null);
  readonly selectedPersonaId = this._selectedPersonaId.asReadonly();

  readonly personaBtns =
    viewChildren<ElementRef<HTMLButtonElement>>('personaBtn');

  readonly successData = computed(() => this.summaryResource.value() ?? null);

  readonly personas = computed(() => this.successData()?.personas ?? []);

  readonly selectedPersona = computed(() => {
    const id = this._selectedPersonaId();
    if (!id) return null;
    return this.personas().find((p) => p.id === id) ?? null;
  });

  protected close(): void {
    this._dialogRef.close();
  }

  protected selectPersona(id: PersonaId): void {
    const current = this._selectedPersonaId();
    this._selectedPersonaId.set(current === id ? null : id);
  }

  protected getPersonaTabindex(id: PersonaId, index: number): number {
    const selected = this._selectedPersonaId();
    if (selected === id) return 0;
    if (selected === null && index === 0) return 0;
    return -1;
  }

  protected onPersonaKeydown(event: KeyboardEvent, index: number): void {
    const btns = this.personaBtns();
    if (!btns.length) return;

    let nextIndex = index;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % btns.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + btns.length) % btns.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = btns.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    btns[nextIndex].nativeElement.focus();
  }
}
