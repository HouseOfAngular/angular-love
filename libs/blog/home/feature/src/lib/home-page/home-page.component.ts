import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { CardComponent } from '@angular-love/blog/shared/ui/card';
import { NewsletterComponent } from '@angular-love/newsletter';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [CardComponent, ArticlesListContainerComponent, NewsletterComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
