import { Component } from '@angular/core';

@Component({
  selector: 'al-top-banner',
  template: `
    <a
      class="flex w-full flex-wrap justify-center gap-[5px] px-[10px] py-3 text-[18px] font-medium text-white"
      style="background-image: linear-gradient(0.25turn, #fe5758, #8d52fe)"
      href="https://meetup.angular.love/spring-camp-2025/?utm_source=angular.loveweb&utm_medium=baner&utm_campaign=angularspringcamp25"
    >
      <span>
        Free Angular Spring Camp with GDEs - 22nd May at 6 PM (CEST) Online!
      </span>
      <span class="rounded-[4px] bg-white px-[6px] text-[#b10620]">
        Register now
      </span>
    </a>
  `,
})
export class TopBannerComponent {}
