import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { NgClass } from '@angular/common';

@Component({
  selector: 'angular-love-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent, NgClass],
  providers: [provideIcons({ heroMagnifyingGlass })],
})
export class SearchBarComponent {}
