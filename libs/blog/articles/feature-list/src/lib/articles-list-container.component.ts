import { Component } from '@angular/core';

import { CategorySectionContainerComponent } from './category-section-container/category-section-container.component';

@Component({
  selector: 'al-articles-list',
  templateUrl: './articles-list-container.component.html',
  imports: [CategorySectionContainerComponent],
})
export class ArticlesListContainerComponent {}
