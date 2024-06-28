import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { PartnersListComponent } from '../partners-list/partners-list.component';

@Component({
  selector: 'al-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PartnersListComponent, TranslocoDirective],
  templateUrl: './partners.component.html',
})
export class PartnersComponent {}
