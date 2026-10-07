import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Marked } from 'marked';

import { ArticleFaqItem } from '@angular-love/contracts/articles';

// Own instance: `MarkedSetupService` from `@analogjs/content` calls `use()` on the
// global `marked` on every instantiation, which stacks hooks across SSR requests.
const markdown = new Marked({ gfm: true, async: false });

@Component({
  selector: 'al-article-faq',
  imports: [TranslocoDirective],
  template: `
    <section *transloco="let t" aria-labelledby="article-faq-title">
      <h2 id="article-faq-title" class="mb-4 text-3xl font-bold">
        {{ t('articleFaq.title') }}
      </h2>

      <div class="bg-al-card overflow-hidden rounded-lg border shadow-xs">
        @for (item of renderedItems(); track $index) {
          <details name="article-faq" class="al-faq-item group">
            <summary
              class="al-faq-summary flex cursor-pointer list-none items-start gap-4 px-4 py-5 sm:px-6"
            >
              <span
                class="group-open:text-al-primary flex-1 text-base leading-snug font-bold transition-colors sm:text-lg"
              >
                {{ item.question }}
              </span>
              <span aria-hidden="true" class="al-faq-toggle"></span>
            </summary>
            <div
              class="al-faq-answer blog-article-content px-4 pb-6 sm:px-6 sm:pr-16"
              [innerHTML]="item.answer"
            ></div>
          </details>
        }
      </div>
    </section>
  `,
  styles: `
    al-article-faq {
      display: block;
      interpolate-size: allow-keywords;
    }

    .al-faq-item {
      position: relative;

      & + & {
        border-top: 1px solid rgb(var(--border));
      }

      /* Rail echoing the active marker in the table of contents. */
      &::before {
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: 3px;
        background: rgb(var(--primary));
        transform: scaleY(0);
        transform-origin: top;
      }

      &[open]::before {
        transform: scaleY(1);
      }

      &::details-content {
        block-size: 0;
        overflow: hidden;
      }

      &[open]::details-content {
        block-size: auto;
      }
    }

    .al-faq-summary {
      &::-webkit-details-marker {
        display: none;
      }

      &:hover .al-faq-toggle {
        border-color: rgb(var(--primary));
      }

      &:focus-visible {
        outline: 2px solid rgb(var(--primary));
        outline-offset: -2px;
        border-radius: 0.5rem;
      }
    }

    /* Plus that collapses into a minus when open. */
    .al-faq-toggle {
      position: relative;
      flex-shrink: 0;
      width: 1.75rem;
      height: 1.75rem;
      margin-top: -0.125rem;
      border: 1px solid rgb(var(--border));
      border-radius: 9999px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        inset: 50% auto auto 50%;
        width: 0.75rem;
        height: 2px;
        border-radius: 1px;
        background: currentColor;
        translate: -50% -50%;
      }

      &::after {
        rotate: 90deg;
      }

      [open] > summary > & {
        border-color: rgb(var(--primary));
        color: rgb(var(--primary));

        &::after {
          rotate: 0deg;
        }
      }
    }

    /* Doubled class so these win over the shared .blog-article-content rules. */
    .al-faq-answer.blog-article-content {
      & p {
        margin-bottom: 1rem;
        line-height: 1.75;
      }

      & > :last-child {
        margin-bottom: 0;
      }

      & pre {
        margin-bottom: 1rem;
        padding: 1rem;
        overflow-x: auto;
        border-radius: 1rem;
        background: rgb(var(--grey));
        font-size: 0.875rem;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .al-faq-item {
        &::before {
          transition: transform 250ms ease-out;
        }

        &::details-content {
          transition:
            block-size 250ms ease-out,
            content-visibility 250ms allow-discrete;
        }
      }

      .al-faq-toggle {
        transition:
          color 200ms,
          border-color 200ms;

        &::after {
          transition: rotate 250ms ease-out;
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFaqComponent {
  readonly items = input.required<ArticleFaqItem[]>();

  // Angular sanitizes the HTML when binding it to `[innerHTML]`.
  protected readonly renderedItems = computed(() =>
    this.items().map(({ question, answer }) => ({
      question,
      answer: markdown.parse(answer, { async: false }),
    })),
  );
}
