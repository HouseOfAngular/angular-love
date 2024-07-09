import { Component, computed, input } from '@angular/core';
import { cva } from 'class-variance-authority';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//@todo rename to lower cases
export type AlButtonVariant =
  | 'Primary'
  | 'Outline'
  | 'Ghost'
  | 'link'
  | 'Secondary';
export type AlButtonSize = 'small' | 'medium' | 'large';

const buttonVariants = cva(
  `rounded-lg flex cursor-pointer items-center gap-2 no-underline disabled:cursor-[initial] disabled:opacity-50`,
  {
    variants: {
      variant: <Record<AlButtonVariant, string>>{
        Primary: 'bg-al-primary',
        Secondary: 'bg-al-background border',
        Outline: 'border border-al-primary bg-white text-al-primary',
        Ghost: 'bg-transparent',
        link: 'bg-transparent !underline',
      },
      size: <Record<AlButtonSize, string>>{
        small: 'py-2 px-4 text-xs',
        medium: 'py-2 px-8 ',
        large: 'text-xl py-3 px-10',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'Primary',
    },
  },
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[al-button],a[al-button]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    '[class]': 'class()',
  },
})
export class ButtonComponent {
  readonly variant = input<AlButtonVariant>();

  readonly size = input<AlButtonSize>();

  protected class = computed(() => {
    return buttonVariants({
      variant: this.variant(),
      size: this.size(),
    });
  });
}
