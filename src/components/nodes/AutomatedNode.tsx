import React from 'react';
import { NodeProps } from 'reactflow';
import { Zap, Settings } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { AutomatedNodeData } from '../../types/workflow.types';

export const AutomatedNode: React.FC<NodeProps<AutomatedNodeData>> = ({ id, data, selected }) => {
  const paramCount = Object.keys(data.parameters || {}).length;

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={Zap}
      color="bg-gradient-to-r from-purple-500 to-purple-600"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Zap className="w-3 h-3" />
          <span className="truncate">{data.actionLabel || 'No action selected'}</span>
        </div>

        {paramCount > 0 && (
          <div className="flex items-center gap-2">
            <Settings className="w-3 h-3 text-gray-500" />
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              {paramCount} parameters
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};
