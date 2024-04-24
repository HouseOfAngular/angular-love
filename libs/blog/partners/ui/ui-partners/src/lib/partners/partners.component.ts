import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PartnersListComponent } from '@angular-love/blog/partners/ui/partners-list';

@Component({
  selector: 'al-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PartnersListComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent {}
