import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  OnConnect,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from '../nodes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setNodes, setEdges, addNode, selectNode } from '../../store/workflowSlice';
import type { WorkflowNodeData, NodeType } from '../../types/workflow.types';

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

export const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const edges = useAppSelector((state) => state.workflow.edges);

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Sync local state with Redux store
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  // Sync Redux store with local state
  React.useEffect(() => {
    dispatch(setNodes(localNodes));
  }, [localNodes, dispatch]);

  React.useEffect(() => {
    dispatch(setEdges(localEdges));
  }, [localEdges, dispatch]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge_${connection.source}_${connection.target}`,
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
        animated: true,
      };
      setLocalEdges((eds) => addEdge(newEdge, eds));
    },
    [setLocalEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: getId(),
        type,
        position,
        data: createDefaultNodeData(type),
      };

      dispatch(addNode(newNode));
    },
    [reactFlowInstance, dispatch]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      dispatch(selectNode(node.id));
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#10b981';
              case 'task':
                return '#3b82f6';
              case 'approval':
                return '#f97316';
              case 'automated':
                return '#a855f7';
              case 'end':
                return '#ef4444';
              default:
                return '#6b7280';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

// Helper function to create default node data
function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  const baseData = {
    id: getId(),
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
  };

  switch (type) {
    case 'start':
      return {
        ...baseData,
        type: 'start',
        metadata: {},
      };
    case 'task':
      return {
        ...baseData,
        type: 'task',
        assignee: '',
        customFields: {},
      };
    case 'approval':
      return {
        ...baseData,
        type: 'approval',
        approverRole: '',
        requiresComment: false,
      };
    case 'automated':
      return {
        ...baseData,
        type: 'automated',
        actionId: '',
        actionLabel: '',
        parameters: {},
      };
    case 'end':
      return {
        ...baseData,
        type: 'end',
        endMessage: 'Workflow completed',
        showSummary: true,
      };
    default:
      return baseData as any;
  }
}
