import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type NavItem = {
  title: string;
  link: string;
};

@Component({
  selector: 'al-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  public readonly navItems: NavItem[] = [
    { title: 'About us', link: '' },
    { title: 'Angular Meetups', link: '' },
    { title: 'Become an author', link: '' },
  ];
}
