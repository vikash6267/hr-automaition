// Simulation engine types

export interface SimulationContext {
  workflowId: string;
  executionId: string;
  startTime: Date;
  variables: Record<string, any>;
  userContext: {
    userId: string;
    role: string;
    department: string;
  };
}

export interface NodeExecutionResult {
  nodeId: string;
  success: boolean;
  output: any;
  error?: string;
  duration: number;
  logs: string[];
}

export type SimulationStatus = 
  | 'idle' 
  | 'validating' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface SimulationState {
  status: SimulationStatus;
  currentNodeId?: string;
  completedNodes: string[];
  results: NodeExecutionResult[];
  errors: string[];
  progress: number; // 0-100
}
