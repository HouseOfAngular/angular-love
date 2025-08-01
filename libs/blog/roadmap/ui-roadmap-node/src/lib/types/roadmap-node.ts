import { Resource } from '@angular-love/blog/contracts/roadmap';

export interface Creator {
  name: string;
  slug: string;
}

export type Label = 'optional' | 'recommended' | 'comingSoon';

export interface AdditionalDescription {
  introduction: string;
  toPrepareList: string[];
  ending: string;
}

interface RoadmapNodeBase {
  id: string;
  title: string;
  label?: Label;
}

export interface AngularLoveNode extends RoadmapNodeBase {
  additionalDescription: AdditionalDescription;
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
