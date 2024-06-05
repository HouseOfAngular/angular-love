import { Component, computed, input } from '@angular/core';

import { IconComponent, IconType } from '@angular-love/blog/shared/ui-icon';

type ShareItem = {
  href: string;
  icon: IconType;
  ariaLabel: string;
};

@Component({
  standalone: true,
  selector: 'al-article-share-icons',
  imports: [IconComponent],
  template: `
    <div class="flex items-center gap-3">
      <span class="text-lg font-bold">Share this post</span>

      @for (item of items(); track $index) {
        <a
          role="button"
          [attr.aria-label]="item.ariaLabel"
          [href]="item.href"
          target="_blank"
        >
          <al-icon class="text-2xl" [name]="item.icon" />
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
    const text = encodeURI(this.title());

    return [
      {
        icon: 'twitter-x',
        href: `https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=angularlove`,
        ariaLabel: 'Share on Twitter',
      },
      {
        icon: 'linkedIn',
        href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
        ariaLabel: 'Share on LinkedIn',
      },
      {
        icon: 'facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        ariaLabel: 'Share on Facebook',
      },
    ];
  });
}
