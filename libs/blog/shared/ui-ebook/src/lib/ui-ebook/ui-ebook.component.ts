import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-ebook',
  imports: [
    CardComponent,
    GradientCardDirective,
    ButtonComponent,
    NgOptimizedImage,
    TranslocoDirective,
  ],
  templateUrl: './ui-ebook.component.html',
  styleUrl: './ui-ebook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbookComponent {}
