import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PartnersListComponent } from '../partners-list/partners-list.component';

@Component({
  selector: 'al-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PartnersListComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent {}
