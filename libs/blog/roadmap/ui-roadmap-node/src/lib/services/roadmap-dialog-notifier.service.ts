import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { RoadmapStandardNode } from '../types/roadmap-node';

@Injectable({
  providedIn: 'root',
})
export class RoadmapDialogNotifierService {
  private readonly _nodeClicked$ = new Subject<RoadmapStandardNode>();
  private readonly _nodeFocused$ = new Subject<RoadmapStandardNode>();
  public readonly nodeClicked$ = this._nodeClicked$.asObservable();
  public readonly nodeFocused$ = this._nodeFocused$.asObservable();

  notifyNodeClicked(node: RoadmapStandardNode) {
    this._nodeClicked$.next(node);
  }

  notifyNodeFocused(node: RoadmapStandardNode) {
    this._nodeFocused$.next(node);
  }
}
