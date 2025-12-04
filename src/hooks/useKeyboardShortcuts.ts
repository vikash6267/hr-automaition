import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNode, deleteNode, selectNode, clearWorkflow } from '../store/workflowSlice';
import type { Node } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../types/workflow.types';

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

const createDefaultNodeData = (type: NodeType): WorkflowNodeData => {
  const baseData = {
    id: getId(),
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
  };

  switch (type) {
    case 'start':
      return { ...baseData, type: 'start', metadata: {} };
    case 'task':
      return { ...baseData, type: 'task', assignee: '', customFields: {} };
    case 'approval':
      return { ...baseData, type: 'approval', approverRole: '', requiresComment: false };
    case 'automated':
      return { ...baseData, type: 'automated', actionId: '', actionLabel: '', parameters: {} };
    case 'end':
      return { ...baseData, type: 'end', endMessage: 'Workflow completed', showSummary: true };
    default:
      return baseData as any;
  }
};

interface UseKeyboardShortcutsProps {
  onSave: () => void;
  onExport: () => void;
  onValidate: () => void;
  onSimulate: () => void;
  onShowShortcuts: () => void;
}

export const useKeyboardShortcuts = ({
  onSave,
  onExport,
  onValidate,
  onSimulate,
  onShowShortcuts,
}: UseKeyboardShortcutsProps) => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector((state) => state.workflow.selectedNodeId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Ctrl/Cmd + E - Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        onExport();
        return;
      }

      // Ctrl/Cmd + V - Validate
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        onValidate();
        return;
      }

      // Ctrl/Cmd + R - Simulate
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        onSimulate();
        return;
      }

      // Ctrl/Cmd + K - Show Shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onShowShortcuts();
        return;
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'workflow/undo' });
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        dispatch({ type: 'workflow/redo' });
        return;
      }

      // Ctrl/Cmd + Shift + C - Clear Workflow
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (confirm('⚠️ Clear entire workflow?')) {
          dispatch(clearWorkflow());
        }
        return;
      }

      // Delete/Backspace - Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        dispatch(deleteNode(selectedNodeId));
        return;
      }

      // Escape - Deselect node
      if (e.key === 'Escape' && selectedNodeId) {
        dispatch(selectNode(null));
        return;
      }

      // Ctrl/Cmd + 1-5 - Quick add nodes
      if (e.ctrlKey || e.metaKey) {
        const nodeTypeMap: { [key: string]: NodeType } = {
          '1': 'start',
          '2': 'task',
          '3': 'approval',
          '4': 'automated',
          '5': 'end',
        };

        const nodeType = nodeTypeMap[e.key];
        if (nodeType) {
          e.preventDefault();
          const newNode: Node<WorkflowNodeData> = {
            id: getId(),
            type: nodeType,
            position: { x: 250, y: 100 + Math.random() * 200 },
            data: createDefaultNodeData(nodeType),
          };
          dispatch(addNode(newNode));
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selectedNodeId, onSave, onExport, onValidate, onSimulate, onShowShortcuts]);
};
