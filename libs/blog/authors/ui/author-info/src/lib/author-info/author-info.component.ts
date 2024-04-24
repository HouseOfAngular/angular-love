import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'al-author-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './author-info.component.html',
  styleUrl: './author-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorInfoComponent {}
