import { GradientCardComponent } from '@angular-love/gradient-card';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerSend } from '@ng-icons/tabler-icons';

@Component({
  selector: 'al-newsletter',
  standalone: true,
  imports: [GradientCardComponent, NgIconComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ tablerSend })],
})
export class NewsletterComponent {}
