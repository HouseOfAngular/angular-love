import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

export type SectionTitleLink = {
  displayName: string;
  href: string;
};

@Component({
  selector: 'al-section-title',
  templateUrl: './ui-section-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AlLocalizePipe],
})
export class UiSectionTitleComponent {
  readonly title = input.required<string>();
  readonly link = input<SectionTitleLink | null>();
}
