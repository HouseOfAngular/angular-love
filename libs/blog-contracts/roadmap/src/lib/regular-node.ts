import { Resource } from './resource';

export interface RoadmapNodeDTO {
  label?: 'optional' | 'recommended' | 'comingSoon';
  resources: Resource[];
  id: string;
  title: string;
  description: string;
  previousNodeId?: string;
  parentNodeId?: string;
}
