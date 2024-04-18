import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

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

@Directive({
  selector: 'al-card[alGradientCard]',
  standalone: true,
})
export class GradientCardDirective {
  @HostBinding('class')
  hostClasses = '[&>*]:bg-al-pink';
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
  imageSrc = input<string>();

  @HostBinding('class')
  hostClasses = 'block bg-white rounded-lg shadow-sm overflow-hidden';
}
