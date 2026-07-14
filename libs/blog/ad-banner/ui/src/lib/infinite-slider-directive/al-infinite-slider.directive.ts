import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, interval, tap } from 'rxjs';

/**
 * This directive creates an infinite slider from a collection of items (e.g. banners).
 * @example
 * ```html
 * <div class="overflow-hidden">
 *   <div class="flex">
 *     <some-banner-component
 *        *alInfiniteSlider="let banner of banners()"
 *        class="shrink-0 grow-0 basis-full"
 *        [banner]="banner"
 *     />
 *   </div>
 * </div>
 * ```
 **/
@Directive({
  selector: '[alInfiniteSlider]',
  standalone: true,
})
export class AlInfiniteSliderDirective {
  readonly slidesElements = input.required<unknown[]>({
    alias: 'alInfiniteSliderOf', // eslint-disable-line
  });
  readonly msPerSlide = input<number>(7000, {
    alias: 'alInfiniteSliderMsPerSlide',
  });
  readonly msPerAnimation = input<number>(1000, {
    alias: 'alInfiniteSliderMsPerAnimation',
  });

  private readonly _templateRef = inject(TemplateRef);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _element = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    this._initView();
    this._startSlider();
  }

  private _initView() {
    effect(() => {
      this._viewContainerRef.clear();
      this.slidesElements()?.forEach((item, index) => {
        this._viewContainerRef.createEmbeddedView(this._templateRef, {
          $implicit: item,
          index: index,
        });
      });
    });
  }

  private _startSlider() {
    afterNextRender(() => {
      const parentElement = this._element.nativeElement
        .parentElement as HTMLElement;
      if (!parentElement) return;

      // 1. Define the animation using the native browser Web Animations API (WAAPI)
      const animation = parentElement.animate(
        [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)' }],
        {
          duration: this.msPerAnimation(),
          easing: 'ease-in-out',
          fill: 'forwards', // Retains the -100% position when finished
        },
      );

      // Pause it immediately so it doesn't play on load
      animation.pause();

      interval(this.msPerSlide())
        .pipe(
          tap(() => animation.play()),
          // 2. Swapped debounceTime for delay. Semantically cleaner for timed triggers.
          delay(this.msPerSlide() / 2),
          tap(() => {
            // Rearrange slides: 1 | 2 | 3 -> 2 | 3 | 1
            this._moveFirstSlideAtTheEnd();
            // 3. Cancelling the WAAPI animation clears the inline "fill" styles,
            // resetting the visual layout back to 0% offset instantly.
            animation.cancel();
          }),
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe();
    });
  }

  private _moveFirstSlideAtTheEnd() {
    if (this._viewContainerRef.length > 1) {
      this._viewContainerRef.move(
        this._viewContainerRef.get(0)!,
        this._viewContainerRef.length - 1,
      );
    }
  }
}
