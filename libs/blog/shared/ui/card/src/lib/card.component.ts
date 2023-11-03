import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';

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

@Component({
  standalone: true,
  selector: 'angular-love-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgOptimizedImage],
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  @Input() imageSrc?: string;
}
