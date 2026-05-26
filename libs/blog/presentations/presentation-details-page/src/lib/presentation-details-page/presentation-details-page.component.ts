import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { PresentationDetailStore } from '@angular-love/blog/presentations/data-access';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { EbookComponent } from '@angular-love/blog/shared/ui-ebook';

@Component({
  selector: 'al-presentation-details-page',
  imports: [
    NgOptimizedImage,
    ButtonComponent,
    EbookComponent,
    NewsletterComponent,
    TranslocoDirective,
  ],
  templateUrl: './presentation-details-page.component.html',
  styleUrl: './presentation-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationDetailsPageComponent {
  readonly presentationSlug = input.required<string>();

  protected readonly presentationDetailStore = inject(PresentationDetailStore);

  readonly isFetchPresentationDetailLoading =
    this.presentationDetailStore.isFetchPresentationDetailLoading;

  readonly presentation = this.presentationDetailStore.presentation;

  readonly isFetchPresentationDetailError =
    this.presentationDetailStore.isFetchPresentationDetailError;

  constructor() {
    this.presentationDetailStore.fetchPresentationDetail(
      computed(() => this.presentationSlug()),
    );
  }
}
