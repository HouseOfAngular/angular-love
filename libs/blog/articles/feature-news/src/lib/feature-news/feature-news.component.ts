import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-feature-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-news.component.html',
  styleUrl: './feature-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureNewsComponent {}
