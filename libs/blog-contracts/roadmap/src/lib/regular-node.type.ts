import { Resource } from './resource.interface';

export interface RoadmapNodeDTO {
  label?: 'optional' | 'recommended' | 'comingSoon';
  resources: Resource[];
  id: string;
  title: string;
  description: string;
  nodeType: 'angular-love' | 'regular';
  previousNodeId?: string;
  parentNodeId?: string;
}
