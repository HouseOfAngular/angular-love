import { Component, input } from '@angular/core';

@Component({
  selector: 'al-ui-roadmap-node',
  template: `
    <div
      class="node-container relative w-fit text-nowrap rounded-lg bg-[#FDF5FD] text-[#FDF5FD]"
      style="
      --primary-color: #B3004A; --secondary-color: #66002B; --gradient-color: #481CAB; --on-hover-border-1: #923CFF; --on-hover-border-2: #FF006A"
    >
      @if (data().nodeType === 'primary') {
        <div
          class="relative z-10 m-[4px] rounded-lg bg-[--primary-color] px-6 py-4"
        >
          <div class="text-[24px]">{{ data().title }}</div>
        </div>
      } @else if (data().nodeType === 'secondary') {
        <div
          class="relative z-10 m-[2px] rounded-lg  bg-[--secondary-color] px-6 py-4"
        >
          <div class="text-[20px]">{{ data().title }}</div>
        </div>
      } @else if (data().nodeType === 'cluster') {
        <div
          class="relative z-10 m-[2px] rounded-lg  bg-[--secondary-color] px-6 py-4"
        >
          <div class="text-[20px]">{{ data().title }}</div>
        </div>
      } @else if (data().nodeType === 'angular-love') {
        <div
          class="relative z-10 m-[4px] rounded-lg  bg-gradient-to-r from-[--secondary-color] to-[--gradient-color] px-6 py-4"
        >
          <div class="text-[24px]">{{ data().title }}</div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./ui-roadmap-node.component.scss'],
})
export class UiRoadmapNodeComponent {
  readonly data = input.required<{
    title: string;
    nodeType: 'primary' | 'secondary' | 'cluster' | 'angular-love';
  }>();
}
