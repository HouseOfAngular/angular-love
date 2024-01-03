import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';

export const decorators = [
  applicationConfig({
    providers: [
      importProvidersFrom(CommonModule),
      importProvidersFrom(HttpClientModule),
      provideRouter([]),
    ],
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (story: () => any) => {
    return {
      ...story(),
      template: `
        <div class="mat-typography">
            ${story().template}
        </div>`,
    };
  },
];
