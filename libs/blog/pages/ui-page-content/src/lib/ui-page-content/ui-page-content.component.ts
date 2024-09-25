import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'al-page-content',
  standalone: true,
  templateUrl: './ui-page-content.component.html',
  styleUrl: './ui-page-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UiPageContentComponent {
  pageDetailsTitle = input.required<SafeHtml | null>();
  pageDetailsContent = input.required<SafeHtml | null>();
}
