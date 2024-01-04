import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  CardComponent,
  CardContentDirective,
} from '@angular-love/blog/shared/ui/card';

@Component({
  selector: 'al-article-content',
  standalone: true,
  templateUrl: './article-content.component.html',
  styleUrl: './article-content.component.scss',
  imports: [CardComponent, CardContentDirective],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleContentComponent {
  @Input() content?: string;
}
