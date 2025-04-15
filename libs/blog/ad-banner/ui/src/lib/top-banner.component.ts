import { Component } from '@angular/core';

@Component({
  selector: 'al-top-banner',
  template: `
    <a
      class="flex w-full flex-wrap justify-center gap-[5px] px-[10px] py-3 text-[18px] font-medium text-white"
      style="background-image: linear-gradient(0.25turn, #fe5758, #8d52fe)"
      href="https://www.youtube.com/watch?v=Ygnx8eH4acg"
    >
      <span class="rounded-[4px] bg-white px-[6px] text-[#b10620]">
        ANGULAR SPRING CAMP
      </span>
      <span>&nbsp;- JOIN LIVE TODAY AT 6 PM (CEST)</span>
    </a>
  `,
})
export class TopBannerComponent {}
