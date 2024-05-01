import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'al-feature-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-news.component.html',
  styleUrl: './feature-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureNewsComponent {}
