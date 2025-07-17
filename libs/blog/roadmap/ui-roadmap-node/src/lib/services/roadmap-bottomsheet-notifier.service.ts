import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { RoadmapStandardNode } from '../types/roadmap-node';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomSheetNotifierService {
  private readonly _node = new Subject<RoadmapStandardNode>();
  private readonly _nodeFocused = new Subject<RoadmapStandardNode>();
  public readonly nodeAsObservable = this._node.asObservable();
  public readonly focusedNodeAsObservable = this._nodeFocused.asObservable();

  openBottomSheet(node: RoadmapStandardNode) {
    this._node.next(node);
  }

  focusNode(node: RoadmapStandardNode) {
    this._nodeFocused.next(node);
  }
}
