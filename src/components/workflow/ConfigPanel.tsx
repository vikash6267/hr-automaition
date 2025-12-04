import React from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectNode, deleteNode } from '../../store/workflowSlice';
import { StartNodeForm } from '../forms/StartNodeForm';
import { TaskNodeForm } from '../forms/TaskNodeForm';
import { ApprovalNodeForm } from '../forms/ApprovalNodeForm';
import { AutomatedNodeForm } from '../forms/AutomatedNodeForm';
import { EndNodeForm } from '../forms/EndNodeForm';

export const ConfigPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector((state) => state.workflow.selectedNodeId);
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const isPanelOpen = useAppSelector((state) => state.workflow.isPanelOpen);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!isPanelOpen || !selectedNode) {
    return null;
  }

  const handleClose = () => {
    dispatch(selectNode(null));
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      dispatch(deleteNode(selectedNodeId));
    }
  };

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'task':
        return <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'approval':
        return <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'automated':
        return <AutomatedNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      case 'end':
        return <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as any} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <>
      {/* Overlay for Mobile/Tablet */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        onClick={handleClose}
      />

      {/* Config Panel */}
      <div className="fixed lg:relative right-0 top-0 w-full sm:w-96 bg-white border-l border-gray-200 flex flex-col h-full z-40 shadow-xl lg:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Node Configuration</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Delete Node
          </button>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
