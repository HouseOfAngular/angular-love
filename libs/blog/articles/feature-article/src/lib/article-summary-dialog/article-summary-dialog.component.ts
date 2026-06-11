import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import {
  ArticlesService,
  ArticleSummaryResponse,
  PersonaId,
} from '@angular-love/blog/articles/data-access';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

import { ArticleSummaryDialogService } from './article-summary-dialog.service';

type SummaryState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: ArticleSummaryResponse };

const PERSONA_IMAGE_MAP: Record<PersonaId, string> = {
  coach: '/assets/Subject.webp',
  takeaways: '/assets/Subject2.webp',
  mentor: '/assets/Subject3.webp',
  hotTake: '/assets/Subject4.webp',
};

@Component({
  selector: 'al-article-summary-dialog',
  templateUrl: './article-summary-dialog.component.html',
  imports: [
    CdkTrapFocus,
    NgClass,
    NgxSkeletonLoaderModule,
    ButtonComponent,
    FastSvgComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSummaryDialogComponent implements OnInit {
  private readonly _dialogRef = inject(DialogRef<void>);
  private readonly _slug = inject<string>(DIALOG_DATA);
  private readonly _articlesService = inject(ArticlesService);
  private readonly _summaryDialogService = inject(ArticleSummaryDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly personaImageMap = PERSONA_IMAGE_MAP;

  private readonly _state = signal<SummaryState>({ status: 'loading' });
  readonly state = this._state.asReadonly();

  private readonly _selectedPersonaId = signal<PersonaId | null>(null);
  readonly selectedPersonaId = this._selectedPersonaId.asReadonly();

  readonly personaBtns =
    viewChildren<ElementRef<HTMLButtonElement>>('personaBtn');

  readonly successData = computed(() => {
    const s = this.state();
    return s.status === 'success' ? s.data : null;
  });

  readonly personas = computed(() => this.successData()?.personas ?? []);

  readonly selectedPersona = computed(() => {
    const id = this._selectedPersonaId();
    if (!id) return null;
    return this.personas().find((p) => p.id === id) ?? null;
  });

  ngOnInit(): void {
    this.loadSummary();
  }

  protected loadSummary(): void {
    const cached = this._summaryDialogService.getCached(this._slug);
    if (cached) {
      this._state.set({ status: 'success', data: cached });
      return;
    }

    this._state.set({ status: 'loading' });
    this._articlesService
      .getSummary(this._slug)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this._summaryDialogService.setCached(this._slug, data);
          this._state.set({ status: 'success', data });
        },
        error: () => {
          this._state.set({ status: 'error' });
        },
      });
  }

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
