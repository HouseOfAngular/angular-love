import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'min-h-screen grid grid-rows-[auto_1fr_auto]',
  },
})
export class LayoutComponent {}
