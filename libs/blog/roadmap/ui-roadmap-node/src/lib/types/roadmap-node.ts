import { Resource } from '@angular-love/blog/contracts/roadmap';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { Creator } from '../../../../../../blog-contracts/roadmap/src/lib/creator.interface';

interface RoadmapNodeBase {
  id: string;
  title: string;
}

export interface AngularLoveNode extends RoadmapNodeBase {
  additionalDescription: string;
  nodeType: 'angular-love';
  creators: Creator[];
  description: string;
}

export interface PrimaryNode extends RoadmapNodeBase {
  resources: Resource[];
  nodeType: 'primary';
  description: string;
}

export interface SecondaryNode extends RoadmapNodeBase {
  resources: Resource[];
  nodeType: 'secondary';
  description: string;
}

export type RoadmapRegularNode = PrimaryNode | SecondaryNode;
export type RoadmapStandardNode = AngularLoveNode | RoadmapRegularNode;

export interface RoadmapClusterNode extends RoadmapNodeBase {
  nodeType: 'cluster';
  clusteredNodes: RoadmapStandardNode[];
}

export type RoadmapNode = RoadmapStandardNode | RoadmapClusterNode;
