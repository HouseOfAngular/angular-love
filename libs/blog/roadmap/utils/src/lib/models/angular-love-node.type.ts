import { BaseNode } from './base-node.type';
import { Creator } from './creator.type';

export type AngularLoveNode = BaseNode & {
  additionalDescription: string;
  creators: Creator[];
};
