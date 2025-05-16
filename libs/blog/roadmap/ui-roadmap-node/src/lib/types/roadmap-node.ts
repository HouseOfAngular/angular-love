interface RoadmapNodeBase {
  id: string;
  title: string;
}

export interface RoadmapStandardNode extends RoadmapNodeBase {
  nodeType: 'primary' | 'secondary' | 'angular-love';
}

export interface RoadmapClusterNode extends RoadmapNodeBase {
  nodeType: 'cluster';
  clusteredNodes?: RoadmapStandardNode[];
}

export type RoadmapNode = RoadmapStandardNode | RoadmapClusterNode;
