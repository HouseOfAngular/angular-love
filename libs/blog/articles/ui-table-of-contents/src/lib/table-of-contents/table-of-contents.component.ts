import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Anchor } from '@angular-love/contracts/articles';

@Component({
  selector: 'al-table-of-contents',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent {
  readonly anchors = input.required<Anchor[]>();

  readonly activeAnchorTitle = model<string | undefined>(undefined);

  readonly anchorClick = output<Anchor>();
}
