import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { UiAuthorInfo } from '@angular-love/blog/authors/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { DynamicTextClampComponent } from '@angular-love/blog/shared/ui-dynamic-text-clamp';

import { AuthorInfoTemplateComponent } from './author-info-template.component';

@Component({
  selector: 'al-author-info',
  standalone: true,
  imports: [
    AuthorInfoTemplateComponent,
    AvatarComponent,
    DynamicTextClampComponent,
  ],
  templateUrl: './author-info.component.html',
  styleUrl: './author-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorInfoComponent {
  author = input.required<UiAuthorInfo>();

  clampText = input<boolean>();

  descriptionClass = computed(
    () => 'text-sm' + (this.clampText() ? ' line-clamp-3' : ''),
  );
}
