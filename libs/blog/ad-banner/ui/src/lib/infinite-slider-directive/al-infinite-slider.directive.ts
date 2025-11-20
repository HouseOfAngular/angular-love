import { animate, AnimationBuilder, style } from '@angular/animations';
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
import { debounceTime, interval, tap } from 'rxjs';

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
  private readonly _builder = inject(AnimationBuilder);
  private readonly _element = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    this._initView();
    this._startSlider();
  }

  private _initView() {
    effect(() => {
      this.slidesElements()?.forEach((item, index) => {
        // Create a new embedded view for each item in the collection
        this._viewContainerRef.createEmbeddedView(this._templateRef, {
          $implicit: item, // Pass the current item as the context
          index: index, // Pass the current index as part of the context
        });
      });
    });
  }

  private _startSlider() {
    afterNextRender(() => {
      const animationPlayer = this._builder
        .build([
          style({ transform: `translateX(0%)` }),
          animate(
            `${this.msPerAnimation()}ms ease-in-out`,
            style({ transform: `translateX(-100%)` }),
          ),
        ])
        .create(this._element.nativeElement.parentElement);

      interval(this.msPerSlide())
        .pipe(
          tap(() => animationPlayer.play()),
          debounceTime(this.msPerSlide() / 2),
          tap(() => {
            // rearrange the slides so 1 | 2 | 3 becomes 2 | 3 | 1
            this._moveFirstSlideAtTheEnd();
            // reset the animation to compensate rearranging the slides
            animationPlayer.reset();
          }),
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe();
    });
  }

  private _moveFirstSlideAtTheEnd() {
    // Detach the first view and append it to the end
    this._viewContainerRef.move(
      this._viewContainerRef.get(0)!,
      this._viewContainerRef.length - 1,
    );
  }
}
