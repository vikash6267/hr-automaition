import React from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/workflow.types';

export const StartNode: React.FC<NodeProps<StartNodeData>> = ({ id, data, selected }) => {
  const metadataCount = Object.keys(data.metadata || {}).length;

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={Play}
      color="bg-gradient-to-r from-green-500 to-green-600"
      showTargetHandle={false}
    >
      {metadataCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Metadata:</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            {metadataCount} fields
          </span>
        </div>
      )}
    </BaseNode>
  );
};
