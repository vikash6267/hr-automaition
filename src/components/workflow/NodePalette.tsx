import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Flag, Plus } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { NodeType, WorkflowNodeData } from '../../types/workflow.types';
import type { Node } from 'reactflow';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const paletteItems: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    icon: Play,
    color: 'from-green-500 to-green-600',
    description: 'Workflow entry point',
  },
  {
    type: 'task',
    label: 'Task',
    icon: CheckSquare,
    color: 'from-blue-500 to-blue-600',
    description: 'Manual task assignment',
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: UserCheck,
    color: 'from-orange-500 to-orange-600',
    description: 'Approval step',
  },
  {
    type: 'automated',
    label: 'Automated',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    description: 'Automated action',
  },
  {
    type: 'end',
    label: 'End',
    icon: Flag,
    color: 'from-red-500 to-red-600',
    description: 'Workflow completion',
  },
];

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

export const NodePalette: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { addNode } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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

  const handleAddNode = (nodeType: NodeType) => {
    const newNode: Node<WorkflowNodeData> = {
      id: getId(),
      type: nodeType,
      position: { x: 250, y: 100 + Math.random() * 200 },
      data: createDefaultNodeData(nodeType),
    };
    addNode(newNode);
    setIsOpen(false); // Close sidebar on mobile after adding
  };

  return (
    <>
      {/* Toggle Button for Mobile/Tablet - Fixed position to avoid overlap */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 lg:hidden bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Open Node Palette"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          top-0 left-0
          h-full
          w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Node Palette</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      
      <div className="space-y-3">
        {paletteItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.type} className="relative group">
              {/* Desktop: Draggable */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                className="hidden lg:block cursor-move bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-800">{item.label}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                </div>
              </div>

              {/* Mobile: Clickable with Add Button */}
              <div className="lg:hidden bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-800">{item.label}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleAddNode(item.type)}
                    className="flex-shrink-0 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    aria-label={`Add ${item.label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong className="hidden lg:inline">Tip:</strong>
            <span className="hidden lg:inline"> Drag and drop nodes onto the canvas</span>
            <span className="lg:hidden">Tap the + button to add nodes to canvas</span>
          </p>
        </div>
      </div>
    </>
  );
};
