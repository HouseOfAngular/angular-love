import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

@Component({
  selector: 'al-not-found',
  imports: [NgOptimizedImage, ButtonComponent, RouterLink, TranslocoDirective],
  template: `
    <section
      aria-labelledby="not-found-title"
      class="mx-2 mt-4 grid grid-cols-3 gap-8 md:mx-12"
    >
      <div
        *transloco="let t; read: 'notFoundPage'"
        class="col-span-3 self-center lg:col-span-1"
      >
        <h2
          id="not-found-title"
          class="flex justify-center text-9xl font-extrabold wrap-break-word lg:justify-normal"
          [attr.aria-label]="t('ariaLabels.title')"
        >
          {{ t('title') }}
        </h2>
        <p
          class="mx-auto my-8 max-w-xl text-center font-thin lg:text-start"
          [attr.aria-label]="t('ariaLabels.description')"
        >
          {{ t('description') }}
        </p>
        <div class="flex justify-center lg:justify-normal">
          <button
            al-button
            class="items-center self-center uppercase"
            [attr.aria-label]="t('ariaLabels.buttonText')"
            routerLink="/"
          >
            {{ t('buttonText') }}
          </button>
        </div>
      </div>

      <img
        alt=""
        class="-order-1 col-span-3 lg:order-1 lg:col-span-2"
        ngSrc="assets/not-found.svg"
        width="1200"
        height="600"
      />
    </section>
  `,
})
export class NotFoundPageComponent {}
