export interface BaseNodeDTO {
  id: string;
  title: string;
  description: string;
  nodeType: 'angular-love' | 'regular';
  previousNodeId?: string;
  parentNodeId?: string;
}
