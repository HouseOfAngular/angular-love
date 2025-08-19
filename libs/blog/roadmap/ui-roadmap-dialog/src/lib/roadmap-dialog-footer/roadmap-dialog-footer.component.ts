import { Component, computed, input } from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { IconType } from '@angular-love/blog/shared/ui-icon';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

type ShareItem = {
  href: string;
  icon: IconType;
  ariaLabel: string;
};
@Component({
  selector: 'al-roadmap-dialog-footer',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [subtitle]="subtitle()" />
      <ul class="flex flex-row gap-4 py-4">
        @for (item of items(); track item.href) {
          <li>
            <a
              role="button"
              [attr.aria-label]="item.ariaLabel"
              [href]="item.href"
              target="_blank"
            >
              <fast-svg
                class="text-al-foreground"
                [name]="item.icon"
                size="30"
              />
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  imports: [RoadmapDialogSubtitleComponent, FastSvgComponent],
})
export class RoadmapDialogFooterComponent {
  readonly subtitle = input.required<string>();
  readonly nodeTitle = input.required<string>();
  readonly nodeId = input.required<string>();
  readonly language = input.required<string>();

  readonly nodeUrl = computed(() =>
    this.language() === 'pl_PL'
      ? `https://angular.love/pl/roadmap?nodeId=${this.nodeId()}`
      : `https://angular.love/roadmap?nodeId=${this.nodeId()}`,
  );

  protected readonly items = computed<ShareItem[]>(() => {
    const url = this.nodeUrl();
    const text = encodeURIComponent(this.nodeTitle());

    return [
      {
        icon: 'twitter-x',
        href: `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=angularlove`,
        ariaLabel: 'articleShareIcons.twitterAriaLabel',
      },
      {
        icon: 'linkedIn',
        href: `https://www.linkedin.com/shareArticle?url=${url}`,
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
