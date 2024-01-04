import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@angular-love/blog/shared/ui/card';
import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ArticlesListContainerComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
