import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'al-analog-home',
  imports: [AnalogWelcomeComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <al-analog-analog-welcome />
  `,
})
export default class HomeComponent {}
