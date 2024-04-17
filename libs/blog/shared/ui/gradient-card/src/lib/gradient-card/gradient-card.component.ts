import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'al-gradient-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gradient-card.component.html',
  styleUrl: './gradient-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientCardComponent {}
