import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'al-analog-home',
  imports: [AnalogWelcomeComponent],
  template: `
    <al-analog-analog-welcome />
  `,
})
export default class HomeComponent {}
