import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-gradient-card',
  standalone: true,
  templateUrl: './gradient-card.component.html',
  styleUrl: './gradient-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientCardComponent {}
