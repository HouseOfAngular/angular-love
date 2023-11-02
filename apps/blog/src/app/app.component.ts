import { Component } from '@angular/core';
import { LayoutComponent } from "@angular-love/blog/layouts/ui";

@Component({
  standalone: true,
  imports: [LayoutComponent],
  selector: 'angular-love-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
