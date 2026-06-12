import { CdkTrapFocus } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
  selector: 'al-dialog-shell',
  templateUrl: './dialog-shell.component.html',
  styleUrl: './dialog-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus, FastSvgComponent],
})
export class DialogShellComponent {
  readonly title = input.required<string>();
  /** Optional overline label shown above the title (e.g. "AI · TL;DR"). */
  readonly label = input<string>('');
  /** aria-describedby id — pass the id of the element that describes the dialog content. */
  readonly ariaDescribedBy = input<string>('');

  readonly closed = output<void>();
}
