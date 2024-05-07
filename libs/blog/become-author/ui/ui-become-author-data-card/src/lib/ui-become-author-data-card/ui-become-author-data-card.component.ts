import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type Layout = 'PRIMARY' | 'SECONDARY';

@Component({
  selector: 'al-ui-become-author-data-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-become-author-data-card.component.html',
  styleUrl: './ui-become-author-data-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBecomeAuthorDataCardComponent {
  index = input<number>();
  info = input.required<string>();
  layout = input.required<Layout>();
  showIndex = input.required<boolean>();
}
