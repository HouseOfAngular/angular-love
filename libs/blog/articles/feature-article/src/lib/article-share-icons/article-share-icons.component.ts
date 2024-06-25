import { Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { IconComponent, IconType } from '@angular-love/blog/shared/ui-icon';

type ShareItem = {
  href: string;
  icon: IconType;
  ariaLabel: string;
};

@Component({
  standalone: true,
  selector: 'al-article-share-icons',
  imports: [IconComponent, TranslocoDirective],
  template: `
    <div class="flex items-center gap-4">
      <span *transloco="let t" class="text-lg font-bold">
        {{ t('articleShareIcons.title') }}
      </span>

      @for (item of items(); track $index) {
        <a
          *transloco="let t"
          role="button"
          [attr.aria-label]="t(item.ariaLabel)"
          [href]="item.href"
          target="_blank"
        >
          <al-icon class="bg-al-foreground block h-7" [name]="item.icon" />
        </a>
      }
    </div>
  `,
})
export class ArticleShareIconsComponent {
  slug = input.required<string>();
  title = input.required<string>();

  readonly items = computed<ShareItem[]>(() => {
    const url = `https://angular.love/${this.slug()}`;
    const text = encodeURIComponent(this.title());

    return [
      {
        icon: 'twitter-x',
        href: `https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=angularlove`,
        ariaLabel: 'articleShareIcons.twitterAriaLabel',
      },
      {
        icon: 'linkedIn',
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
        ariaLabel: 'articleShareIcons.linkedInAriaLabel',
      },
      {
        icon: 'facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        ariaLabel: 'articleShareIcons.facebookAriaLabel',
      },
    ];
  });
}
