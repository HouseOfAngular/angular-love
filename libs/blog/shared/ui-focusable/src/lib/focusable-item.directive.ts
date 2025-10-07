import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[alFocusableItem]',
})
export class FocusableItemDirective implements FocusableOption {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  readonly focusDisabled = input<boolean>(false);

  get disabled(): boolean {
    return this.focusDisabled();
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
