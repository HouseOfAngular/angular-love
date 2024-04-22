import { Component, HostBinding, Input } from '@angular/core';

export type AlButtonVariant = 'Primary' | 'Outline' | 'Ghost';

const hostClassMap: Record<AlButtonVariant, string> = {
  Primary: 'al-button al-button--primary rounded-lg px-8 py-2',
  Outline: 'al-button al-button--outline rounded-lg px-8 py-2',
  Ghost: 'al-button al-button--ghost rounded-lg px-8 py-2',
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[al-button],a[al-button]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @HostBinding('class')
  hostClasses = '';

  @Input() set variant(val: AlButtonVariant) {
    this.hostClasses = hostClassMap[val];
  }
}
