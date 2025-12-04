import React from 'react';
import { NodeProps } from 'reactflow';
import { UserCheck, Clock } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow.types';

export const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={UserCheck}
      color="bg-gradient-to-r from-orange-500 to-orange-600"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <UserCheck className="w-3 h-3" />
          <span className="truncate">{data.approverRole}</span>
        </div>

        {data.autoApproveThreshold !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Auto-approve:</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
              {data.autoApproveThreshold}%
            </span>
          </div>
        )}

        {data.escalationTimeout && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Escalate after {data.escalationTimeout}h</span>
          </div>
        )}

        {data.requiresComment && (
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Comment required
          </span>
        )}
      </div>
    </BaseNode>
  );
};
