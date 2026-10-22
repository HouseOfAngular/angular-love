import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

import { Partner } from '@angular-love/blog/shared/types';

@Component({
  selector: 'al-partners-list',
  templateUrl: './partners-list.component.html',
  imports: [NgOptimizedImage],
})
export class PartnersListComponent {
  readonly partnersList = input.required<Partner[]>();
}
