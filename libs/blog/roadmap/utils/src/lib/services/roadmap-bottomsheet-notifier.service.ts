import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomSheetNotifierService {
  private nodeId = new Subject<string>();
  public readonly nodeIdAsObservable = this.nodeId.asObservable();

  openBottomSheet(nodeId: string) {
    this.nodeId.next(nodeId);
  }
}
