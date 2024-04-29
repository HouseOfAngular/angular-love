import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  HostBinding,
  inject,
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
  standalone: true,
  selector: 'al-card[alGradientCard]',
})
export class GradientCardDirective {
  @HostBinding('class')
  get hostClasses() {
    return 'border border-al-gray-200 !bg-al-gradient bg-al-gray-500 text-white';
  }
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

  ref: ElementRef<HTMLElement> = inject(ElementRef);

  @HostBinding('class')
  hostClasses = 'block rounded-lg shadow-sm overflow-hidden';

  @HostBinding('class.bg-white') get hasWhiteBackground() {
    return !this.ref.nativeElement.hasAttribute('alGradientCard');
  }
}
