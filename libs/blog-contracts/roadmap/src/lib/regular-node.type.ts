import { BaseNodeDTO } from './base-node.interface';
import { Resource } from './resource.interface';

export interface RegularNodeDTO extends BaseNodeDTO {
  nodeType: 'regular';
  label?: 'optional' | 'recommended' | 'comingSoon';
  resources: Resource[];
}
