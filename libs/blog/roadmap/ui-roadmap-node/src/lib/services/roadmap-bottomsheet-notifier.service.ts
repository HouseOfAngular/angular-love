import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RoadmapStandardNode } from '../types/roadmap-node';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomSheetNotifierService {
  private node = new Subject<RoadmapStandardNode>();
  public readonly nodeIdAsObservable = this.node.asObservable();

  openBottomSheet(node: RoadmapStandardNode) {
    console.log('openBOttomsheet', node);
    this.node.next(node);
  }
}
