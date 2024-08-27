import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
} from '@angular/core';

import { UiTooltipComponent } from './ui-tooltip.component';

@Directive({
  selector: '[alTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  tooltipText = input.required<string | null>();

  private _overlayRef: OverlayRef | null = null;

  private readonly _element = inject(ElementRef<HTMLElement>);
  private readonly _overlay = inject(Overlay);

  @HostListener('mouseenter')
  showTooltip(): void {
    if (this._overlayRef?.hasAttached() === true) {
      return;
    }

    this._attachTooltip();
  }

  @HostListener('mouseleave')
  hideTooltip(): void {
    if (this._overlayRef?.hasAttached() === true) {
      this._overlayRef?.detach();
    }
  }

  ngOnDestroy(): void {
    this._overlayRef?.dispose();
  }

  private _attachTooltip(): void {
    if (this._overlayRef === null) {
      this._overlayRef = this._overlay.create({
        positionStrategy: this._getPositionStrategy(),
      });
    }
    const tooltipRef: ComponentRef<UiTooltipComponent> =
      this._overlayRef.attach(new ComponentPortal(UiTooltipComponent));
    tooltipRef.instance.tooltipText.set(this.tooltipText()!);
  }

  private _getPositionStrategy(): PositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._element)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          panelClass: 'bottom',
        },
      ]);
  }
}
