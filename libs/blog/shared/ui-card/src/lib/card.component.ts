import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
  selector: 'al-card[alDarkGradientCard]',
})
export class DarkGradientCardDirective {
  @HostBinding('class')
  get hostClasses() {
    return 'dark:!bg-al-radial-gradient dark:bg-al-background';
  }
}

@Directive({
  standalone: true,
  selector: 'al-card[alDarkCard]',
})
export class DarkCardDirective {
  @HostBinding('class')
  get hostClasses() {
    return 'border !p-4 !bg-al-background block rounded-lg';
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
  readonly imageSrc = input<string>();

  ref: ElementRef<HTMLElement> = inject(ElementRef);

  @HostBinding('class')
  hostClasses = 'block rounded-lg border bg-al-card shadow-sm overflow-hidden';
}
