import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiAuthorInfo } from '@angular-love/blog/authors/types/author-info-data-model';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';

import { AuthorInfoTemplateComponent } from './author-info-template.component';

@Component({
  selector: 'al-author-info',
  standalone: true,
  imports: [AuthorInfoTemplateComponent, AvatarComponent],
  templateUrl: './author-info.component.html',
  styleUrl: './author-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorInfoComponent {
  author = input.required<UiAuthorInfo>();
}
