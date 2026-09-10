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
  | 'Secondary'
  | 'AI';
export type AlButtonSize = 'small' | 'medium' | 'large';

const buttonVariants = cva(
  `rounded-lg flex cursor-pointer items-center gap-2 justify-center no-underline disabled:cursor-[initial] disabled:opacity-50`,
  {
    variants: {
      variant: <Record<AlButtonVariant, string>>{
        Primary: 'bg-al-primary/90 text-white',
        Secondary: 'bg-al-background border',
        Outline: 'border border-al-primary/90 bg-white text-al-primary',
        Ghost: 'bg-transparent',
        link: 'bg-transparent underline!',
        AI: 'al-btn-ai font-semibold tracking-[0.12em]',
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

const UPPERCASE_BY_DEFAULT: ReadonlySet<AlButtonVariant> = new Set([
  'Primary',
  'AI',
]);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[al-button],a[al-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    '[class]': 'class()',
  },
})
export class ButtonComponent {
  readonly variant = input<AlButtonVariant>();

  readonly size = input<AlButtonSize>();

  // Overrides the variant's default text case
  readonly uppercase = input<boolean>();

  protected class = computed(() => {
    const variant = this.variant() ?? 'Primary';
    const isUppercase =
      this.uppercase() ?? UPPERCASE_BY_DEFAULT.has(variant);

    return cn(
      buttonVariants({
        variant,
        size: this.size(),
      }),
      isUppercase && 'uppercase',
    );
  });
}
