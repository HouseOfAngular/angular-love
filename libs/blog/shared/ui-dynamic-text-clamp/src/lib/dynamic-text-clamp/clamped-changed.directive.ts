import {
  Directive,
  ElementRef,
  inject,
  NgZone,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

import { injectHostResizedEvent } from '@angular-love/blog/shared/utils-inject';

@Directive({
  selector: '[alIsClamped]',
  standalone: true,
  exportAs: 'alIsClamped',
})
export class ClampedChangedDirective {
  clampedChanged = output<boolean>();
  clamped = signal(false);

  private readonly _ngZone = inject(NgZone);
  private readonly _elementRef = inject(ElementRef);
  private readonly _resizedEvent = injectHostResizedEvent();

  public constructor() {
    this._ngZone.runOutsideAngular(() => {
      this._resizedEvent
        .pipe(
          takeUntilDestroyed(),
          map(() => this._isClamped()),
          distinctUntilChanged(),
        )
        .subscribe((isClamped) => {
          this._ngZone.run(() => {
            this.clamped.set(isClamped);
            this.clampedChanged.emit(isClamped);
          });
        });
    });
  }

  private _isClamped(): boolean {
    const element = this._elementRef.nativeElement;
    return (
      element.offsetWidth < element.scrollWidth ||
      element.offsetHeight < element.scrollHeight
    );
  }
}
