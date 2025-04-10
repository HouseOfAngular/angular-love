import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
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
  customPosition = input<ConnectedPosition | null>(null);

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
    tooltipRef.instance.customPosition.set(this.customPosition()!);
  }

  private _getPositionStrategy(): PositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._element)
      .withPositions([
        {
          originX: this.customPosition()?.originX || 'center',
          originY: this.customPosition()?.originY || 'bottom',
          overlayX: this.customPosition()?.overlayX || 'center',
          overlayY: this.customPosition()?.overlayY || 'top',
          panelClass: this.customPosition()?.panelClass || 'bottom',
        },
      ]);
  }
}
