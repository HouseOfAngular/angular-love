import { BaseNodeDTO } from './base-node.interface';
import { Creator } from './creator.interface';

export interface AngularLoveNodeDTO extends BaseNodeDTO {
  nodeType: 'angular-love';
  additionalDescription: string;
  creators: Creator[];
}
