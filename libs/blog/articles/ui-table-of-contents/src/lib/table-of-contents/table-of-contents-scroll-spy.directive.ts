import { DestroyRef, Directive, inject, input, NgZone } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
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

    const anchors$ = toObservable(this._tableOfContents.anchors);

    combineLatest([scrollEvent$, anchors$])
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(10),
        map(([{ scrollY }, anchors]) =>
          anchors.reduce((currentTitle, section) => {
            const element = document.getElementById(section.title);
            if (!element) {
              throw new Error(
                `Anchor element with title '${section.title}' not found in the DOM`,
              );
            }
            const sectionTop = element.offsetTop - 16;

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
