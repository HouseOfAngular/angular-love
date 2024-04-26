import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Host,
  input,
} from '@angular/core';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';

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

@Directive({
  standalone: true,
  selector: '[alCardLayoutDirective]',
})
export class AlCardLayoutDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: ArticleUiCardComponent,
  ) {
    if (parent.layout() === 'VERTICAL') {
      this.el.nativeElement.classList.add(
        'flex',
        'flex-col',
        'w-[408px]',
        'h-[450px]',
      );
    } else {
      this.el.nativeElement.classList.add(
        'flex',
        'flex-row',
        'w-[1288px]',
        'h-[220px]',
      );
    }
  }
}

@Directive({
  standalone: true,
  selector: '[alCardContentLayoutDirective]',
})
export class AlCardContentLayoutDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: ArticleUiCardComponent,
  ) {
    parent.layout() === 'VERTICAL'
      ? this.el.nativeElement.classList.add(
          'w-[408px]',
          'h-[230px]',
          'rounded-b-lg',
        )
      : this.el.nativeElement.classList.add(
          'w-[880px]',
          'h-[220px]',
          'rounded-r-lg',
        );
  }
}

@Directive({
  standalone: true,
  selector: '[alCardImageLayoutDirective]',
})
export class AlCardImageLayoutDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: ArticleUiCardComponent,
  ) {
    parent.layout() === 'VERTICAL'
      ? this.el.nativeElement.classList.add(
          'rounded-t-lg',
          'background-vertical',
        )
      : this.el.nativeElement.classList.add(
          'rounded-l-lg',
          'background-horizontal',
        );
  }
}

@Directive({
  standalone: true,
  selector: '[alCardHeaderAndExcerptLayoutDirective]',
})
export class AlCardHeaderAndExcerptLayoutDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: ArticleUiCardComponent,
  ) {
    parent.layout() === 'VERTICAL'
      ? this.el.nativeElement.classList.add('px-4', 'pt-3', 'pb-4')
      : this.el.nativeElement.classList.add('px-6', 'pt-8');
  }
}

@Directive({
  standalone: true,
  selector: '[alCardExcerptLayoutDirective]',
})
export class AlCardExcerptLayoutDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: ArticleUiCardComponent,
  ) {
    parent.layout() === 'HORIZONTAL'
      ? this.el.nativeElement.classList.add('pt-5')
      : '';
  }
}

@Component({
  selector: 'al-ui-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    NgIcon,
    DatePipe,
    AlCardLayoutDirective,
    NgOptimizedImage,
    AlCardContentLayoutDirective,
    AlCardImageLayoutDirective,
    AlCardHeaderAndExcerptLayoutDirective,
    AlCardExcerptLayoutDirective,
  ],
  templateUrl: './article-ui-card.component.html',
  styleUrl: './article-ui-card.component.scss',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class ArticleUiCardComponent {
  layout = input.required<Layout>();
  article = input.required<ArticleData>();
}
