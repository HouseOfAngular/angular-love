import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Host,
  input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CardComponent } from '@angular-love/blog/shared/ui/card';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';

export type UiArticleCardDataModel = {
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
};

export type Layout = 'PRIMARY' | 'SECONDARY';

@Directive({
  standalone: true,
  selector: '[alBackgroundCardDirective]',
})
export class AlBackgroundCardDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: BackgroundArticleCardComponent
  ) {
    parent.layout() === 'PRIMARY'
      ? this.el.nativeElement.classList.add(
          'shadow-[inset_-100px_-200px_100px_100px_rgba(20,21,27,.85)]'
        )
      : '';
  }
}

@Directive({
  standalone: true,
  selector: '[alBackgroundCardInfoDirective]',
})
export class AlBackgroundCardInfoDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: BackgroundArticleCardComponent
  ) {
    parent.layout() === 'PRIMARY'
      ? this.el.nativeElement.classList.add('px-6 pt-6')
      : this.el.nativeElement.classList.add('px-8 pt-8');
  }
}

@Directive({
  standalone: true,
  selector: '[alBackgroundCardContentDirective]',
})
export class AlBackgroundCardContentDirective {
  constructor(
    private el: ElementRef,
    @Host() parent: BackgroundArticleCardComponent
  ) {
    parent.layout() === 'PRIMARY'
      ? this.el.nativeElement.classList.add('px-6 pt-8')
      : this.el.nativeElement.classList.add('pt-11 px-8');
  }
}

@Component({
  selector: 'al-background-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CardComponent,
    AvatarComponent,
    NgIcon,
    NgOptimizedImage,
    RouterLink,
    AlBackgroundCardDirective,
    AlBackgroundCardInfoDirective,
    AlBackgroundCardContentDirective,
  ],
  templateUrl: './background-article-card.component.html',
  styleUrl: './small-article-card.component.scss',
  providers: [
    provideIcons({
      bootstrapClock,
    }),
  ],
})
export class BackgroundArticleCardComponent {
  layout = input.required<Layout>();
  article = input.required<UiArticleCardDataModel>();
}
