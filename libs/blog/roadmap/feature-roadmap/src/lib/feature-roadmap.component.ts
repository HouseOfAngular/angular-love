import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxGraphModule, Orientation } from '@swimlane/ngx-graph';

// class CustomLayout implements Layout {
//   updateEdge(graph: Graph, edge: Edge): Graph | Observable<Graph> {}
//
//   run(graph: any): any {
//     return graph;
//   }
// }

@Component({
  selector: 'al-feature-roadmap',
  imports: [NgxGraphModule],
  templateUrl: './feature-roadmap.component.html',
  styleUrl: './feature-roadmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureRoadmapComponent {
  onNodeClick($event: any) {
    console.log('Node clicked', $event);
  }

  protected readonly Orientation = Orientation;
}
