import {Component, HostBinding, Input} from '@angular/core';
import { CommonModule } from '@angular/common';


export type AlButtonVariant = 'Primary' | 'Secondary' |  'Outline';

const hostClassMap: Record<AlButtonVariant, string> = {
  Primary: 'al-button al-button--primary rounded-lg px-8 py-2',
  Secondary: 'al-button al-button--secondary rounded-lg px-8 py-2',
  Outline: 'al-button al-button--outline rounded-lg px-8 py-2',
}


@Component({
  selector: 'button[al-button],a[al-button]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() set variant(val: AlButtonVariant) {
    this.hostClasses = hostClassMap[val];
  };

  @HostBinding('class')
  hostClasses = '';
}
