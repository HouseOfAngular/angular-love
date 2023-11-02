import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button[al-button],a[al-button]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {}
