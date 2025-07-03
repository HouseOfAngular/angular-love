import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { RoadmapStandardNode } from '../types/roadmap-node';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomSheetNotifierService {
  private node = new Subject<RoadmapStandardNode>();
  public readonly nodeIdAsObservable = this.node.asObservable();

  openBottomSheet(node: RoadmapStandardNode) {
    this.node.next(node);
  }
}
