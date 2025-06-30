import { BaseNodeDTO } from './base-node.type';
import { Creator } from './creator.type';

export interface AngularLoveNodeDTO extends BaseNodeDTO {
  nodeType: 'angular-love';
  additionalDescription: string;
  creators: Creator[];
}
