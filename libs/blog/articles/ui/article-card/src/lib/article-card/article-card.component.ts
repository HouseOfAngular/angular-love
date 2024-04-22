import { Component, Directive, ElementRef, Input, input } from '@angular/core';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon } from '@ng-icons/core';
import { DatePipe } from '@angular/common';

export type Layout = 'HORIZONTAL' | 'VERTICAL';

export type ArticleData = {
  title: string;
  excerpt: string;
  slug: string;
  publishDate: string;
  featuredImageUrl: string;
  readingTime: number;
  author: {
    name: string;
    avatarUrl: string;
  };
};

const modelData: ArticleData = {
  title: 'Why Angular signals won’t replace RxJs',
  excerpt:
    'The micro frontend architecture is a well-known development approach',
  readingTime: 4,
  author: {
    name: 'Adam Kasilski',
    avatarUrl:
      'https://testing.angular.love/wp-content/uploads/2023/01/Jakub-Pawlak-150x150.jpg',
  },
  featuredImageUrl:
    'https://testing.angular.love/wp-content/uploads/2023/08/Templatki-do-artykulow.png',
  publishDate: '2023-08-17T11:34:39.000Z',
  slug: 'controlling-angular-animations-programmatically',
};

@Directive({
  standalone: true,
  selector: '[alCardLayoutDirective]',
})
export class AlCardLayoutDirective {
  @Input() layout!: Layout;
  constructor(private el: ElementRef) {
    if (this.layout.valueOf() === 'VERTICAL') {
      this.el.nativeElement.classList.add(
        'flex',
        'flex-col',
        'w-[408px]',
        'h-[450px]'
      );
    } else {
      this.el.nativeElement.classList.add(
        'flex',
        'flex-row',
        'w-[1288px]',
        'h-[220px]'
      );
    }
  }
}

@Directive({
  standalone: true,
  selector: '[alCardContentLayoutDirective]',
})
export class AlCardContentLayoutDirective {
  @Input() layout!: Layout;
  constructor(private el: ElementRef) {
    if (this.layout.valueOf() === 'VERTICAL') {
      this.el.nativeElement.classList.add('px-8 pt-6');
    } else {
      this.el.nativeElement.classList.add('px-6 pb-5');
    }
  }
}

@Component({
  selector: 'al-article-card',
  standalone: true,
  imports: [GenericCardComponent, AvatarComponent, NgIcon, DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  layout = input<Layout>('VERTICAL');
  article = input<ArticleData>(modelData);
}
