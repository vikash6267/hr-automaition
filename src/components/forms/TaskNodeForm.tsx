import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { updateNode } from '../../store/workflowSlice';
import type { TaskNodeData } from '../../types/workflow.types';

interface TaskNodeFormProps {
  nodeId: string;
  data: TaskNodeData;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeId, data }) => {
  const dispatch = useAppDispatch();

  const handleChange = (field: keyof TaskNodeData, value: any) => {
    dispatch(updateNode({ nodeId, data: { [field]: value } }));
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    const newCustomFields = { ...data.customFields, [key]: value };
    dispatch(updateNode({ nodeId, data: { customFields: newCustomFields } }));
  };

  const addCustomField = () => {
    const key = `field_${Object.keys(data.customFields).length + 1}`;
    handleCustomFieldChange(key, '');
  };

  const removeCustomField = (key: string) => {
    const newCustomFields = { ...data.customFields };
    delete newCustomFields[key];
    dispatch(updateNode({ nodeId, data: { customFields: newCustomFields } }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task title"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the task"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignee
        </label>
        <input
          type="text"
          value={data.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          value={data.priority || 'medium'}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Fields
          </label>
          <button
            onClick={addCustomField}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Field
          </button>
        </div>
        
        <div className="space-y-2">
          {Object.entries(data.customFields).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newCustomFields = { ...data.customFields };
                  delete newCustomFields[key];
                  newCustomFields[newKey] = value;
                  dispatch(updateNode({ nodeId, data: { customFields: newCustomFields } }));
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Field name"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Field value"
              />
              <button
                onClick={() => removeCustomField(key)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
