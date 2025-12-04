import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData, ValidationResult } from '../types/workflow.types';
import type { SimulationState } from '../types/simulation.types';

interface WorkflowState {
  // Workflow data
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  
  // UI state
  selectedNodeId: string | null;
  isPanelOpen: boolean;
  
  // Workflow metadata
  workflowName: string;
  workflowDescription: string;
  
  // Validation
  validationResult: ValidationResult | null;
  
  // Simulation
  simulationState: SimulationState;
}

const initialSimulationState: SimulationState = {
  status: 'idle',
  completedNodes: [],
  results: [],
  errors: [],
  progress: 0,
};

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isPanelOpen: false,
  workflowName: 'Untitled Workflow',
  workflowDescription: '',
  validationResult: null,
  simulationState: initialSimulationState,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // Node actions
    setNodes: (state, action: PayloadAction<Node<WorkflowNodeData>[]>) => {
      state.nodes = action.payload;
    },
    
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    
    addNode: (state, action: PayloadAction<Node<WorkflowNodeData>>) => {
      state.nodes.push(action.payload);
    },
    
    updateNode: (state, action: PayloadAction<{ nodeId: string; data: Partial<WorkflowNodeData> }>) => {
      const { nodeId, data } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.data = { ...node.data, ...data };
      }
    },
    
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
    },
    
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
    },

    // UI actions
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
      state.isPanelOpen = action.payload !== null;
    },
    
    togglePanel: (state) => {
      state.isPanelOpen = !state.isPanelOpen;
    },

    // Workflow metadata
    setWorkflowName: (state, action: PayloadAction<string>) => {
      state.workflowName = action.payload;
    },
    
    setWorkflowDescription: (state, action: PayloadAction<string>) => {
      state.workflowDescription = action.payload;
    },

    // Validation
    setValidationResult: (state, action: PayloadAction<ValidationResult | null>) => {
      state.validationResult = action.payload;
    },

    // Simulation
    setSimulationState: (state, action: PayloadAction<SimulationState>) => {
      state.simulationState = action.payload;
    },

    // Utility actions
    clearWorkflow: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.workflowName = 'Untitled Workflow';
      state.workflowDescription = '';
      state.validationResult = null;
      state.simulationState = initialSimulationState;
    },
    
    loadWorkflow: (
      state,
      action: PayloadAction<{
        nodes: Node<WorkflowNodeData>[];
        edges: Edge[];
        name: string;
        description: string;
      }>
    ) => {
      const { nodes, edges, name, description } = action.payload;
      state.nodes = nodes;
      state.edges = edges;
      state.workflowName = name;
      state.workflowDescription = description;
      state.selectedNodeId = null;
      state.validationResult = null;
      state.simulationState = initialSimulationState;
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  deleteEdge,
  selectNode,
  togglePanel,
  setWorkflowName,
  setWorkflowDescription,
  setValidationResult,
  setSimulationState,
  clearWorkflow,
  loadWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;
