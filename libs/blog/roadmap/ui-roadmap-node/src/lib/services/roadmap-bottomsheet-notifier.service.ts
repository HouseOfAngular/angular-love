import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { RoadmapStandardNode } from '../types/roadmap-node';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomSheetNotifierService {
  private readonly _node = new Subject<RoadmapStandardNode>();
  public readonly nodeAsObservable = this._node.asObservable();

  openBottomSheet(node: RoadmapStandardNode) {
    this._node.next(node);
  }
}
