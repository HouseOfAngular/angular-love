import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoadmapBottomsheetManagerService {
  private readonly nodeId = new Subject<string>();
  public bottomSheetOpen$ = this.nodeId.asObservable();

  openBottomSheet(id: string): void {
    this.nodeId.next(id);
  }
}
