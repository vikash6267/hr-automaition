// API request/response types

export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  category: 'email' | 'document' | 'notification' | 'integration';
  params: AutomationParam[];
  icon?: string;
}

export interface AutomationParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface SimulateWorkflowRequest {
  workflow: {
    nodes: any[];
    edges: any[];
  };
  context?: Record<string, any>;
}

export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: string;
  endTime?: string;
  duration?: number;
  output?: any;
  error?: string;
  logs: string[];
}

export interface SimulateWorkflowResponse {
  success: boolean;
  executionId: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  steps: SimulationStep[];
  finalOutput: any;
  errors: string[];
}

export interface SaveWorkflowRequest {
  name: string;
  description: string;
  workflow: any;
  metadata: Record<string, any>;
}

export interface SaveWorkflowResponse {
  id: string;
  message: string;
  version: string;
}
