import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  Input,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Directive({
  standalone: true,
  selector: '[angularLoveCardHeader]',
})
export class CardHeaderDirective {
  @HostBinding('class')
  hostClasses = 'block text-xl font-bold';
}

@Directive({
  standalone: true,
  selector: '[angularLoveCardContent]',
})
export class CardContentDirective {
  @HostBinding('class')
  hostClasses = 'block';
}

@Directive({
  standalone: true,
  selector: '[angularLoveCardFooter]',
})
export class CardFooterDirective {
  @HostBinding('class')
  hostClasses = 'mt-4 text-sm';
}

@Directive({
  standalone: true,
  selector: '[angularLoveCardHoverHighlight]',
})
export class CardHoverHighlightDirective {
  @HostBinding('class')
  hostClasses =
    'hover:bg-red-50 outline outline-1 outline-transparent hover:outline-red-400 transition';
}

@Directive({
  standalone: true,
  selector: '[angularLoveCardLinkable]',
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
  selector: 'angular-love-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class CardComponent {
  @Input() imageSrc?: string;

  @HostBinding('class')
  hostClasses = 'block bg-white rounded-lg shadow-sm overflow-hidden';
}
