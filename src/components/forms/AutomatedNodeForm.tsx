import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { updateNode } from '../../store/workflowSlice';
import { mockApi } from '../../services/mockApi';
import type { AutomatedNodeData } from '../../types/workflow.types';
import type { AutomationAction } from '../../types/api.types';

interface AutomatedNodeFormProps {
  nodeId: string;
  data: AutomatedNodeData;
}

export const AutomatedNodeForm: React.FC<AutomatedNodeFormProps> = ({ nodeId, data }) => {
  const dispatch = useAppDispatch();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<AutomationAction | null>(null);

  useEffect(() => {
    loadAutomations();
  }, []);

  useEffect(() => {
    if (data.actionId && automations.length > 0) {
      const action = automations.find(a => a.id === data.actionId);
      setSelectedAction(action || null);
    }
  }, [data.actionId, automations]);

  const loadAutomations = async () => {
    try {
      const actions = await mockApi.getAutomations();
      setAutomations(actions);
    } catch (error) {
      console.error('Failed to load automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AutomatedNodeData, value: any) => {
    dispatch(updateNode({ nodeId, data: { [field]: value } }));
  };

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    if (action) {
      dispatch(
        updateNode({
          nodeId,
          data: {
            actionId: action.id,
            actionLabel: action.label,
            parameters: {},
          },
        })
      );
      setSelectedAction(action);
    }
  };

  const handleParameterChange = (paramName: string, value: any) => {
    const newParameters = { ...data.parameters, [paramName]: value };
    dispatch(updateNode({ nodeId, data: { parameters: newParameters } }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Node Title *
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter node title"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Describe the automated action"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Action *
        </label>
        {loading ? (
          <div className="text-sm text-gray-500">Loading actions...</div>
        ) : (
          <select
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">-- Select an action --</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
        {selectedAction && (
          <p className="text-xs text-gray-500 mt-1">{selectedAction.description}</p>
        )}
      </div>

      {selectedAction && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Action Parameters</h3>
          <div className="space-y-3">
            {selectedAction.params.map((param) => (
              <div key={param.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {param.label} {param.required && <span className="text-red-500">*</span>}
                </label>
                
                {param.type === 'select' ? (
                  <select
                    value={data.parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">-- Select --</option>
                    {param.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : param.type === 'number' ? (
                  <input
                    type="number"
                    value={data.parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                    min={param.validation?.min}
                    max={param.validation?.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder={param.placeholder}
                  />
                ) : param.type === 'boolean' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.parameters[param.name] || false}
                      onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{param.placeholder}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={data.parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder={param.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
