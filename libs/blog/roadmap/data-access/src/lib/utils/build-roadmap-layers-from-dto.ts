import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';
import { RoadmapLayer } from '@angular-love/blog/roadmap/ui-roadmap';
import {
  RoadmapClusterNode,
  RoadmapNode,
  RoadmapStandardNode,
} from '@angular-love/blog/roadmap/ui-roadmap-node';

export function buildRoadmapLayersFromDto(
  roadmapNodesDto: RoadmapNodeDTO[] | undefined,
  roadmapTitleLayer: RoadmapLayer,
): RoadmapLayer[] {
  if (!roadmapNodesDto) {
    return [];
  }

  const allNodeDtosMap = createAllNodeDtosMap(roadmapNodesDto);
  const layerChildNodeIdsMap: { [parentNodeId: string]: string[] } = {};
  const clusterChildNodeIdsMap: { [clusterNodeId: string]: string[] } = {};
  const allNodesMap: { [nodeId: string]: RoadmapNode } = {};

  // Build all the initial maps
  roadmapNodesDto.forEach((nodeDto) => {
    // Only primary nodes don't have a parent node id
    if (!nodeDto.parentNodeId) {
      allNodesMap[nodeDto.id] = createPrimaryNode(nodeDto);

      layerChildNodeIdsMap[nodeDto.id] ??= [];
      return;
    }

    // Node is a child of a cluster node - it's a secondary node
    if (allNodeDtosMap[nodeDto.parentNodeId].parentNodeId) {
      const parentClusterNodeDto = allNodeDtosMap[nodeDto.parentNodeId];

      // Setup cluster nodes map as it's the only place where it's possible to do so
      clusterChildNodeIdsMap[parentClusterNodeDto.id] ??= [];
      clusterChildNodeIdsMap[parentClusterNodeDto.id].push(nodeDto.id);

      if (allNodesMap[nodeDto.parentNodeId]) {
        // Promote an already stored node to a cluster node as it might have been created as a secondary node
        allNodesMap[parentClusterNodeDto.id] = {
          ...allNodesMap[nodeDto.parentNodeId],
          nodeType: 'cluster',
          clusteredNodes: [],
        };
      } else {
        allNodesMap[parentClusterNodeDto.id] =
          createClusterNode(parentClusterNodeDto);
      }
    } else {
      // Layer child node - either cluster or secondary
      layerChildNodeIdsMap[nodeDto.parentNodeId] ??= [];
      layerChildNodeIdsMap[nodeDto.parentNodeId].push(nodeDto.id);
    }

    if (!allNodesMap[nodeDto.id]) {
      // There is no way to tell if a node is a secondary or a cluster node,
      // so we initially assume it's a secondary node
      allNodesMap[nodeDto.id] = createSecondaryNode(nodeDto);
    }
  });

  // Setup clusters
  Object.entries(clusterChildNodeIdsMap).forEach(
    ([clusterNodeId, childrenNodeIds]) => {
      const clusterNode = allNodesMap[clusterNodeId] as RoadmapClusterNode;

      getOrderedNodeIdsList(childrenNodeIds, allNodeDtosMap).forEach(
        (nodeId) => {
          const clusterChildNode = allNodesMap[nodeId] as RoadmapStandardNode;
          clusterNode.clusteredNodes.push(clusterChildNode);
        },
      );
    },
  );

  // Setup layers
  const primaryNodeIds = Object.keys(layerChildNodeIdsMap);
  const layers: RoadmapLayer[] = getOrderedNodeIdsList(
    primaryNodeIds,
    allNodeDtosMap,
  ).map((primaryNodeId) => {
    const parentNode = allNodesMap[primaryNodeId] as RoadmapStandardNode;
    const childNodes = layerChildNodeIdsMap[primaryNodeId].map(
      (childrenNodeId) => allNodesMap[childrenNodeId],
    );
    return { parentNode, childNodes };
  });

  return [roadmapTitleLayer, ...layers];
}

function createPrimaryNode({
  id,
  title,
  description,
  resources,
  label,
}: RoadmapNodeDTO): RoadmapStandardNode {
  return { id, nodeType: 'primary', title, description, resources, label };
}

function createSecondaryNode({
  id,
  title,
  description,
  resources,
  label,
}: RoadmapNodeDTO): RoadmapStandardNode {
  return { id, nodeType: 'secondary', title, description, resources, label };
}

function createClusterNode({ id, title }: RoadmapNodeDTO): RoadmapClusterNode {
  return { id, nodeType: 'cluster', title, clusteredNodes: [] };
}

function getOrderedNodeIdsList(
  nodeIds: string[],
  allNodeDtosMap: { [nodeId: string]: RoadmapNodeDTO },
): string[] {
  const chainedNodeIdsMap: {
    [previousNodeId: string | 'initialNode']: string;
  } = {};

  nodeIds.forEach((nodeId) => {
    const nodeDto = allNodeDtosMap[nodeId];
    const previousNodeId = nodeDto.previousNodeId || 'initialNode';
    chainedNodeIdsMap[previousNodeId] = nodeId;
  });

  let nextNodeId = chainedNodeIdsMap['initialNode'];
  const orderedNodeIds: string[] = [];
  while (nextNodeId) {
    orderedNodeIds.push(nextNodeId);
    nextNodeId = chainedNodeIdsMap[nextNodeId];
  }

  return orderedNodeIds;
}

function createAllNodeDtosMap(roadmapNodesDto: RoadmapNodeDTO[]) {
  return roadmapNodesDto.reduce(
    (acc, node) => {
      acc[node.id] = node;
      return acc;
    },
    {} as { [nodeId: string]: RoadmapNodeDTO },
  );
}
