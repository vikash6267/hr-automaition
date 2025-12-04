import React from 'react';
import { NodeProps } from 'reactflow';
import { Flag, Bell } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/workflow.types';

export const EndNode: React.FC<NodeProps<EndNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={Flag}
      color="bg-gradient-to-r from-red-500 to-red-600"
      showSourceHandle={false}
    >
      <div className="space-y-2">
        {data.showSummary && (
          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            Show summary
          </span>
        )}

        {data.notifyUsers && data.notifyUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Bell className="w-3 h-3" />
            <span>Notify {data.notifyUsers.length} users</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};
