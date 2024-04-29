import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'al-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  pageName = input.required<string>();
}
