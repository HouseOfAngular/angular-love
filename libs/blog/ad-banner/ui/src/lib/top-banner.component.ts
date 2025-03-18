import { Component } from '@angular/core';

@Component({
  selector: 'al-top-banner',
  template: `
    <a
      class="flex w-full flex-wrap justify-center gap-[5px] px-[10px] py-3 text-[18px] font-medium text-white"
      style="background-image: linear-gradient(0.25turn, #fe5758, #8d52fe)"
      href="https://houseofangular.io/the-ultimate-guide-to-angular-evolution/?utm_source=www-al&utm_medium=baner&utm_campaign=angular19-evolution"
    >
      <span>Enhance Your Project with</span>
      <span class="rounded-[4px] bg-white px-[6px] text-[#f9506a]">
        Angular 19
      </span>
      <span class="underline">Download a free ebook!</span>
    </a>
  `,
})
export class TopBannerComponent {}
