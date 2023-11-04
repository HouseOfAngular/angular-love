import { Component } from '@angular/core';
import { LayoutComponent } from '@angular-love/blog/layouts/ui';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  standalone: true,
  imports: [LayoutComponent, NgIconComponent],
  selector: 'angular-love-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [provideIcons({ heroUsers })],
})
export class AppComponent {}
