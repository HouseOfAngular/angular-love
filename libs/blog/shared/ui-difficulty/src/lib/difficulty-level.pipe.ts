import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'difficultyLevelTooltip',
  standalone: true,
})
export class DifficultyLevelPipe implements PipeTransform {
  private readonly _translocoService = inject(TranslocoService);
  transform(difficultyLevel: number): Observable<string> {
    return this._translocoService.langChanges$.pipe(
      map(() => {
        switch (difficultyLevel) {
          case 0:
            return this._translocoService.translate(
              'difficulty.tooltipBeginner',
            );
          case 1:
            return this._translocoService.translate(
              'difficulty.tooltipIntermediate',
            );
          case 2:
            return this._translocoService.translate(
              'difficulty.tooltipAdvanced',
            );
          default:
            return this._translocoService.translate(
              'difficulty.tooltipIntermediate',
            );
        }
      }),
    );
  }
}
