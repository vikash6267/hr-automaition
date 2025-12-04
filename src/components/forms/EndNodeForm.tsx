import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { updateNode } from '../../store/workflowSlice';
import type { EndNodeData } from '../../types/workflow.types';

interface EndNodeFormProps {
  nodeId: string;
  data: EndNodeData;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeId, data }) => {
  const dispatch = useAppDispatch();

  const handleChange = (field: keyof EndNodeData, value: any) => {
    dispatch(updateNode({ nodeId, data: { [field]: value } }));
  };

  const handleNotifyUsersChange = (value: string) => {
    const users = value.split(',').map((u) => u.trim()).filter((u) => u);
    dispatch(updateNode({ nodeId, data: { notifyUsers: users } }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Node Title *
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter end node title"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Describe the workflow completion"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Completion Message *
        </label>
        <textarea
          value={data.endMessage}
          onChange={(e) => handleChange('endMessage', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Message to display when workflow completes"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showSummary"
          checked={data.showSummary}
          onChange={(e) => handleChange('showSummary', e.target.checked)}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label htmlFor="showSummary" className="ml-2 text-sm text-gray-700">
          Show workflow summary on completion
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notify Users
        </label>
        <input
          type="text"
          value={data.notifyUsers?.join(', ') || ''}
          onChange={(e) => handleNotifyUsersChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="user1@example.com, user2@example.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Comma-separated list of email addresses to notify
        </p>
      </div>
    </div>
  );
};
