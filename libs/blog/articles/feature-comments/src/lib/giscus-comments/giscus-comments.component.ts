import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';

import 'giscus';

import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@ngneat/transloco';

import {
  GISCUS_CONFIG,
  provideComments,
} from '@angular-love/blog/articles/data-access';

@Component({
  selector: 'al-giscus-comments',
  standalone: true,
  imports: [],
  templateUrl: './giscus-comments.component.html',
  styleUrl: './giscus-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full w-full min-h-[326px] flex items-center',
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideComments()],
})
export class GiscusCommentsComponent {
  readonly config = inject(GISCUS_CONFIG);
  readonly translocoService = inject(TranslocoService);

  readonly lang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });
}
