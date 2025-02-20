import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';

@Component({
  selector: 'al-become-author-writing-rules-add',
  imports: [
    CommonModule,
    CardComponent,
    RouterLink,
    TranslocoDirective,
    GradientCardDirective,
  ],
  templateUrl: './become-author-writing-rules-add.component.html',
})
export class BecomeAuthorWritingRulesAddComponent {}
