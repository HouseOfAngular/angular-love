import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  Input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

export type Layout = 'NORMAL' | 'ARTICLE-SMALL' | 'ARTICLE' | 'ARTICLE-BIG';

@Directive({
  standalone: true,
  selector: '[alCardHeader]',
})
export class CardHeaderDirective {
  @HostBinding('class')
  hostClasses = 'block text-xl font-bold';
}

@Directive({
  standalone: true,
  selector: '[alCardContent]',
})
export class CardContentDirective {
  @HostBinding('class')
  hostClasses = 'block';
}

@Directive({
  standalone: true,
  selector: '[alCardFooter]',
})
export class CardFooterDirective {
  @HostBinding('class')
  hostClasses = 'mt-4 text-sm';
}

@Directive({
  standalone: true,
  selector: '[alCardHoverHighlight]',
})
export class CardHoverHighlightDirective {
  @HostBinding('class')
  hostClasses =
    'hover:bg-red-50 outline outline-1 outline-transparent hover:outline-red-400 transition';
}

@Directive({
  standalone: true,
  selector: '[alCardLinkable]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink'],
    },
  ],
})
export class CardLinkableDirective {
  @HostBinding('class')
  hostClasses = 'hover:cursor-pointer';
}

@Component({
  standalone: true,
  selector: 'al-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class CardComponent {
  @Input() imageSrc?: string;
  @Input() layout: Layout = 'NORMAL';

  @HostBinding('class')
  hostClasses = 'block bg-white rounded-lg shadow-sm overflow-hidden';
}
