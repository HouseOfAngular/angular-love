import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapClock } from '@ng-icons/bootstrap-icons';
import { RouterLink } from '@angular/router';

export type Layout = 'compact' | 'hero';

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

@Directive({
  standalone: true,
  selector: '[alBackgroundCardDirective]',
})
export class AlBackgroundCardDirective implements OnInit {
  private el = inject(ElementRef);
  layout = input.required<Layout>();

  ngOnInit(): void {
    this.layout() === 'compact'
      ? this.el.nativeElement.classList.add(
          'shadow-[inset_-100px_-200px_100px_100px_rgba(20,21,27,.85)]',
          'bg-cover',
        )
      : this.el.nativeElement.classList.add(
          'bg-center',
          'hover:bg-al-gradient-middle-bottom',
        );
  }
}

@Directive({
  standalone: true,
  selector: '[alBackgroundCardInfoDirective]',
})
export class AlBackgroundCardInfoDirective implements OnInit {
  private el = inject(ElementRef);
  layout = input.required<Layout>();

  ngOnInit(): void {
    this.layout() === 'compact'
      ? this.el.nativeElement.classList.add('px-6', 'pt-6')
      : this.el.nativeElement.classList.add('px-8', 'pt-8');
  }
}

@Directive({
  standalone: true,
  selector: '[alBackgroundCardContentDirective]',
})
export class AlBackgroundCardContentDirective implements OnInit {
  private el = inject(ElementRef);
  layout = input.required<Layout>();

  ngOnInit(): void {
    this.layout() === 'compact'
      ? this.el.nativeElement.classList.add('px-6', 'pt-8', 'pb-6')
      : this.el.nativeElement.classList.add('pt-44', 'px-8', 'pb-8');
  }
}

@Component({
  selector: 'al-background-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AvatarComponent,
    NgIcon,
    NgOptimizedImage,
    RouterLink,
    AlBackgroundCardDirective,
    AlBackgroundCardInfoDirective,
    AlBackgroundCardContentDirective,
    DatePipe,
  ],
  templateUrl: './background-article-card.component.html',
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
