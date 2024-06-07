import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

import { ClampedChangedDirective } from './clamped-changed.directive';

@Component({
  selector: 'al-dynamic-text-clamp',
  standalone: true,
  imports: [
    ButtonComponent,
    ClampedChangedDirective,
    NgClass,
    TranslocoDirective,
  ],
  templateUrl: './dynamic-text-clamp.component.html',
  styleUrl: './dynamic-text-clamp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTextClampComponent {
  readonly text = input.required<string>();
  readonly textClasses = input<string>();

  protected readonly readMore = signal<boolean>(false);

  protected toggleReadMore() {
    this.readMore.set(!this.readMore());
  }
}
