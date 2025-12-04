// Core workflow type definitions

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  assignee: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole: string;
  autoApproveThreshold?: number;
  requiresComment: boolean;
  escalationTimeout?: number; // in hours
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId: string;
  actionLabel: string;
  parameters: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
  notifyUsers?: string[];
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    category: 'onboarding' | 'leave' | 'document' | 'custom';
    tags: string[];
    author: string;
  };
}

export interface ValidationError {
  type: 'error' | 'warning';
  nodeId?: string;
  edgeId?: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
