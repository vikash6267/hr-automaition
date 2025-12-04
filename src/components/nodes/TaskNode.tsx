import React from 'react';
import { NodeProps } from 'reactflow';
import { CheckSquare, User, Calendar } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/workflow.types';

export const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ id, data, selected }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={CheckSquare}
      color="bg-gradient-to-r from-blue-500 to-blue-600"
    >
      <div className="space-y-2">
        {data.assignee && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span className="truncate">{data.assignee}</span>
          </div>
        )}
        
        {data.dueDate && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{new Date(data.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {data.priority && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Priority:</span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColors[data.priority]}`}>
              {data.priority}
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};
