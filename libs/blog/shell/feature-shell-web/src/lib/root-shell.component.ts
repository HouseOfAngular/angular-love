import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
} from '@angular-love/blog/layouts/ui-layouts';
import { SearchComponent } from '@angular-love/blog/search/feature-search';

@Component({
  selector: 'al-root-shell',
  template: `
    <al-header [language]="'ENG'"><al-search /></al-header>
    <al-layout>
      <router-outlet />
    </al-layout>
    <al-footer class="mt-auto block" />
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    SearchComponent,
  ],
})
export class RootShellComponent {}
