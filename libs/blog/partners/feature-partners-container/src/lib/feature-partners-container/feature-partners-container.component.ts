import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePartnersListComponent } from '@angular-love/feature-partners-list';

@Component({
  selector: 'al-feature-partners-container',
  standalone: true,
  imports: [CommonModule, FeaturePartnersListComponent],
  templateUrl: './feature-partners-container.component.html',
  styleUrl: './feature-partners-container.component.scss',
})
export class FeaturePartnersContainerComponent {}
