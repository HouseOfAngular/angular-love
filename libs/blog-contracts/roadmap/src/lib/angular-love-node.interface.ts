import { BaseNodeDTO } from './base-node.interface';
import { Creator } from './creator.interface';

export interface AngularLoveNodeDTO extends BaseNodeDTO {
  nodeType: 'angular-love';
  additionalDescription: {
    introduction: string;
    toPrepareList: string[];
    ending: string;
  };
  creators: Creator[];
}
