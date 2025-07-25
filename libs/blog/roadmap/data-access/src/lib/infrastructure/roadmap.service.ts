import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private readonly _http = inject(HttpClient);

  getNodes(): Observable<RoadmapNodeDTO[]> {
    return this._http.get<RoadmapNodeDTO[]>('assets/roadmap-tiles.json', {
      responseType: 'json',
    });
  }
}
