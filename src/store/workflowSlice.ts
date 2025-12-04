import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData, ValidationResult } from '../types/workflow.types';
import type { SimulationState } from '../types/simulation.types';

interface HistoryState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

interface WorkflowState {
  // Workflow data
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  
  // History for undo/redo
  history: HistoryState[];
  historyIndex: number;
  
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
  history: [],
  historyIndex: -1,
  selectedNodeId: null,
  isPanelOpen: false,
  workflowName: 'Untitled Workflow',
  workflowDescription: '',
  validationResult: null,
  simulationState: initialSimulationState,
};

// Helper to save history
const saveHistory = (state: WorkflowState) => {
  // Remove any future history if we're not at the end
  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1);
  }
  
  // Add current state to history
  state.history.push({
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
  });
  
  // Limit history to 50 states
  if (state.history.length > 50) {
    state.history.shift();
  } else {
    state.historyIndex++;
  }
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
      saveHistory(state);
      state.nodes.push(action.payload);
    },
    
    updateNode: (state, action: PayloadAction<{ nodeId: string; data: Partial<WorkflowNodeData> }>) => {
      const { nodeId, data } = action.payload;
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.data = { ...node.data, ...data } as any;
      }
    },
    
    deleteNode: (state, action: PayloadAction<string>) => {
      saveHistory(state);
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
    
    // Undo/Redo actions
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const previousState = state.history[state.historyIndex];
        state.nodes = JSON.parse(JSON.stringify(previousState.nodes));
        state.edges = JSON.parse(JSON.stringify(previousState.edges));
        state.selectedNodeId = null;
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        state.nodes = JSON.parse(JSON.stringify(nextState.nodes));
        state.edges = JSON.parse(JSON.stringify(nextState.edges));
        state.selectedNodeId = null;
      }
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
      saveHistory(state);
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
  undo,
  redo,
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
