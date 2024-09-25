import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { PageDetailsStore } from '@angular-love/blog/pages/data-access';
import { UiPageContentComponent } from '@angular-love/blog/pages/ui-page-content';

import { PageDetailsSkeletonComponent } from '../page-details/page-details-skeleton.component';

@Component({
  selector: 'al-page-details-container',
  standalone: true,
  imports: [UiPageContentComponent, PageDetailsSkeletonComponent],
  templateUrl: './page-details-container.component.html',
})
export class PageDetailsContainerComponent {
  private readonly _pageDetailsStore = inject(PageDetailsStore);
  private readonly _domSanitizer = inject(DomSanitizer);

  readonly slug = input.required<string>();
  readonly pageDetails = this._pageDetailsStore.pageDetails;
  readonly isFetchPageDetailsLoading =
    this._pageDetailsStore.isFetchPageDetailsLoading;
  readonly isFetchPageDetailsError =
    this._pageDetailsStore.isFetchPageDetailsError;

  protected readonly sanitizedContent = computed(() => {
    const pageDetails = this.pageDetails();
    if (!pageDetails) return null;
    return this._domSanitizer.bypassSecurityTrustHtml(pageDetails.content);
  });
  protected readonly sanitizedTitle = computed(() => {
    const pageDetails = this.pageDetails();
    if (!pageDetails) return null;
    return this._domSanitizer.bypassSecurityTrustHtml(pageDetails.title);
  });

  constructor() {
    this._pageDetailsStore.fetchPageDetails(this.slug);
  }
}
