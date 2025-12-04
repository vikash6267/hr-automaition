import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Flag } from 'lucide-react';
import type { NodeType } from '../../types/workflow.types';

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

export const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Node Palette</h2>
      
      <div className="space-y-3">
        {paletteItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="cursor-move bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all"
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
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Drag and drop nodes onto the canvas to build your workflow
        </p>
      </div>
    </div>
  );
};
