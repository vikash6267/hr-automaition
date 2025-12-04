import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { updateNode } from '../../store/workflowSlice';
import type { StartNodeData } from '../../types/workflow.types';

interface StartNodeFormProps {
  nodeId: string;
  data: StartNodeData;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeId, data }) => {
  const dispatch = useAppDispatch();

  const handleChange = (field: keyof StartNodeData, value: any) => {
    dispatch(updateNode({ nodeId, data: { [field]: value } }));
  };

  const handleMetadataChange = (key: string, value: string) => {
    const newMetadata = { ...data.metadata, [key]: value };
    dispatch(updateNode({ nodeId, data: { metadata: newMetadata } }));
  };

  const addMetadataField = () => {
    const key = `field_${Object.keys(data.metadata).length + 1}`;
    handleMetadataChange(key, '');
  };

  const removeMetadataField = (key: string) => {
    const newMetadata = { ...data.metadata };
    delete newMetadata[key];
    dispatch(updateNode({ nodeId, data: { metadata: newMetadata } }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Node Title *
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter start node title"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe the workflow start conditions"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Metadata Fields
          </label>
          <button
            onClick={addMetadataField}
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            + Add Field
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mb-2">
          Define initial workflow context variables
        </p>

        <div className="space-y-2">
          {Object.entries(data.metadata).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newMetadata = { ...data.metadata };
                  delete newMetadata[key];
                  newMetadata[newKey] = value;
                  dispatch(updateNode({ nodeId, data: { metadata: newMetadata } }));
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Key"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleMetadataChange(key, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Value"
              />
              <button
                onClick={() => removeMetadataField(key)}
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
