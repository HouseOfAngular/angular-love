import { computed, Directive, input } from '@angular/core';
import { cva } from 'class-variance-authority';

export type AlPillVariant = 'flat' | 'outline';
export type AlPillSize = 'small' | 'medium' | 'large';

const pillVariants = cva(
  `inline-flex items-center rounded-full border-2 border-al-primary/90 transition-colors duration-300 hover:cursor-pointer`,
  {
    variants: {
      variant: <Record<AlPillVariant, string>>{
        flat: 'bg-al-primary/90',
        outline: 'bg-al-background',
      },
      size: <Record<AlPillSize, string>>{
        small: 'px-2 py-0.25 text-sm',
        medium: 'px-2.5 py-0.5',
        large: 'px-3.5 py-1 text-lg',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'outline',
    },
  },
);

@Directive({
  standalone: true,
  selector: 'button[alPill]',
  host: {
    '[class]': 'class()',
    role: 'button',
    tabindex: '0',
  },
})
export class PillDirective {
  readonly variant = input<AlPillVariant>();

  readonly size = input<AlPillSize>();

  protected class = computed(() => {
    return pillVariants({
      variant: this.variant(),
      size: this.size(),
    });
  });
}
