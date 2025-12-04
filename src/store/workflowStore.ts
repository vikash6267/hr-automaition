import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Node, Edge, Connection } from 'reactflow';
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
  
  // Actions
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  
  selectNode: (nodeId: string | null) => void;
  togglePanel: () => void;
  
  setWorkflowName: (name: string) => void;
  setWorkflowDescription: (description: string) => void;
  
  setValidationResult: (result: ValidationResult | null) => void;
  setSimulationState: (state: SimulationState) => void;
  
  clearWorkflow: () => void;
  loadWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[], name: string, description: string) => void;
}

const initialSimulationState: SimulationState = {
  status: 'idle',
  completedNodes: [],
  results: [],
  errors: [],
  progress: 0,
};

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isPanelOpen: false,
      workflowName: 'Untitled Workflow',
      workflowDescription: '',
      validationResult: null,
      simulationState: initialSimulationState,

      // Node actions
      setNodes: (nodes) => set({ nodes }),
      
      setEdges: (edges) => set({ edges }),
      
      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node],
      })),
      
      updateNode: (nodeId, data) => set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        ),
      })),
      
      deleteNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      })),
      
      addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge],
      })),
      
      deleteEdge: (edgeId) => set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== edgeId),
      })),

      // UI actions
      selectNode: (nodeId) => set({ 
        selectedNodeId: nodeId,
        isPanelOpen: nodeId !== null,
      }),
      
      togglePanel: () => set((state) => ({ 
        isPanelOpen: !state.isPanelOpen 
      })),

      // Workflow metadata
      setWorkflowName: (name) => set({ workflowName: name }),
      
      setWorkflowDescription: (description) => set({ workflowDescription: description }),

      // Validation
      setValidationResult: (result) => set({ validationResult: result }),

      // Simulation
      setSimulationState: (simulationState) => set({ simulationState }),

      // Utility actions
      clearWorkflow: () => set({
        nodes: [],
        edges: [],
        selectedNodeId: null,
        workflowName: 'Untitled Workflow',
        workflowDescription: '',
        validationResult: null,
        simulationState: initialSimulationState,
      }),
      
      loadWorkflow: (nodes, edges, name, description) => set({
        nodes,
        edges,
        workflowName: name,
        workflowDescription: description,
        selectedNodeId: null,
        validationResult: null,
        simulationState: initialSimulationState,
      }),
    }),
    { name: 'WorkflowStore' }
  )
);
