import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

@Component({
  selector: 'al-not-found',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent, RouterLink],
  template: `
    <section class="mx-2 mt-4 grid grid-cols-3 gap-8 md:mx-12">
      <div class="col-span-3 self-center lg:col-span-1">
        <span
          class="flex justify-center break-words text-9xl font-extrabold lg:justify-normal"
        >
          404
        </span>
        <p class="mx-auto my-8 max-w-xl text-center font-thin lg:text-start">
          You seem to have lost your way. The page you specified does not exist
          or the link has expired and is no longer available.
        </p>
        <div class="flex justify-center lg:justify-normal">
          <button
            al-button
            class="items-center self-center uppercase"
            routerLink="/"
          >
            Go back to homepage
          </button>
        </div>
      </div>

      <img
        alt="Not Found Image"
        class="-order-1 col-span-3 lg:order-1 lg:col-span-2"
        ngSrc="assets/not-found.svg"
        width="1200"
        height="600"
      />
    </section>
  `,
})
export class NotFoundPageComponent {}
