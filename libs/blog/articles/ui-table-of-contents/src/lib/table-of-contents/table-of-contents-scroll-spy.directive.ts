import { DestroyRef, Directive, inject, input, NgZone } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { TableOfContentsComponent } from './table-of-contents.component';

@Directive({
  standalone: true,
  selector: '[alTableOfContentsScrollSpy]',
})
export class TableOfContentsScrollSpyDirective {
  private readonly _ngZone = inject(NgZone);
  private readonly _tableOfContents = inject(TableOfContentsComponent);
  private readonly _destroyRef = inject(DestroyRef);

  readonly scrollContainer = input<Element | Window>(window);

  constructor() {
    this._ngZone.runOutsideAngular(() => this._listenForScroll());
  }

  private _listenForScroll() {
    const scrollEvent$ = toObservable(this.scrollContainer).pipe(
      switchMap((container) =>
        fromEvent(container, 'scroll').pipe(
          map(() => ({
            scrollY: this._getScrollY(container),
          })),
          startWith({ scrollY: this._getScrollY(container) }),
        ),
      ),
    );

    // todo: left to keep in mind how banner influence the layout
    const adBannerVisible$ = of(false);

    const anchors$ = toObservable(this._tableOfContents.anchors);

    combineLatest([scrollEvent$, anchors$, adBannerVisible$])
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(10),
        map(([{ scrollY }, anchors, adBannerVisible]) =>
          anchors.reduce((currentTitle, section) => {
            const header = adBannerVisible ? 160 : 80;
            const element = document.getElementById(section.title);
            const sectionTop = (element?.offsetTop ?? 0) - 16 - header; // 16px padding, 80px header

            return scrollY >= sectionTop ? section.title : currentTitle;
          }, anchors[0]?.title),
        ),
        distinctUntilChanged(),
      )
      .subscribe((activeTitle) => {
        this._ngZone.run(() => {
          this._tableOfContents.activeAnchorTitle.set(activeTitle);
        });
      });
  }

  private _getScrollY(container: Element | Window): number {
    return container === window
      ? window.scrollY
      : (container as Element).scrollTop;
  }
}
