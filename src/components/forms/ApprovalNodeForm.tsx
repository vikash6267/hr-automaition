import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import type { ApprovalNodeData } from '../../types/workflow.types';

interface ApprovalNodeFormProps {
  nodeId: string;
  data: ApprovalNodeData;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeId, data }) => {
  const { updateNode } = useWorkflowStore();

  const handleChange = (field: keyof ApprovalNodeData, value: any) => {
    updateNode(nodeId, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Approval Title *
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter approval title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Describe what needs approval"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Approver Role *
        </label>
        <input
          type="text"
          value={data.approverRole}
          onChange={(e) => handleChange('approverRole', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="e.g., Manager, HR Director"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Auto-Approve Threshold (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={data.autoApproveThreshold || ''}
          onChange={(e) => handleChange('autoApproveThreshold', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Leave empty to disable"
        />
        <p className="text-xs text-gray-500 mt-1">
          Automatically approve if confidence score exceeds this threshold
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Escalation Timeout (hours)
        </label>
        <input
          type="number"
          min="1"
          value={data.escalationTimeout || ''}
          onChange={(e) => handleChange('escalationTimeout', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="e.g., 24"
        />
        <p className="text-xs text-gray-500 mt-1">
          Escalate to higher authority if not approved within this time
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="requiresComment"
          checked={data.requiresComment}
          onChange={(e) => handleChange('requiresComment', e.target.checked)}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="requiresComment" className="ml-2 text-sm text-gray-700">
          Require comment with approval/rejection
        </label>
      </div>
    </div>
  );
};
