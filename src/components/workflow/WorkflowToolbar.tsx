import React, { useState } from 'react';
import { Save, FolderOpen, CheckCircle, Play, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../utils/workflowValidator';
import { mockApi } from '../../services/mockApi';

export const WorkflowToolbar: React.FC = () => {
  const {
    nodes,
    edges,
    workflowName,
    workflowDescription,
    setWorkflowName,
    setValidationResult,
    setSimulationState,
    clearWorkflow,
  } = useWorkflowStore();

  const [isSimulating, setIsSimulating] = useState(false);

  const handleValidate = () => {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    
    if (result.isValid) {
      if (result.warnings.length > 0) {
        toast.success(
          <div className="max-w-md">
            <div className="flex items-start justify-between gap-2 mb-1">
              <strong className="text-sm">✅ Valid ({result.warnings.length} warnings)</strong>
              <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="text-xs text-yellow-200">
              {result.warnings.slice(0, 1).map((w, i) => (
                <div key={i}>• {w.message.substring(0, 80)}...</div>
              ))}
            </div>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.success(
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">✅ Perfect! Ready to simulate</span>
            <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
          </div>,
          { duration: 3000 }
        );
      }
    } else {
      toast.error(
        <div className="max-w-md">
          <div className="flex items-start justify-between gap-2 mb-2">
            <strong className="text-sm">❌ Validation Failed ({result.errors.length} errors)</strong>
            <button
              onClick={() => toast.dismiss()}
              className="text-white/80 hover:text-white flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="text-xs max-h-32 overflow-y-auto space-y-1">
            {result.errors.slice(0, 2).map((e, i) => (
              <div key={i} className="text-red-100">
                • {e.message.substring(0, 100)}{e.message.length > 100 ? '...' : ''}
              </div>
            ))}
            {result.errors.length > 2 && (
              <div className="text-red-200 mt-1">
                +{result.errors.length - 2} more errors
              </div>
            )}
          </div>
        </div>,
        { duration: 6000 }
      );
    }
  };

  const handleSimulate = async () => {
    // First validate
    const validationResult = validateWorkflow(nodes, edges);
    setValidationResult(validationResult);

    if (!validationResult.isValid) {
      toast.error(
        <div className="max-w-md">
          <div className="flex items-start justify-between gap-2 mb-2">
            <strong className="text-sm">❌ Cannot Simulate</strong>
            <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="text-xs">
            Fix {validationResult.errors.length} errors first
          </div>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    setIsSimulating(true);
    setSimulationState({
      status: 'running',
      completedNodes: [],
      results: [],
      errors: [],
      progress: 0,
    });

    const loadingToast = toast.loading('🔄 Simulating workflow... Please wait');

    try {
      const response = await mockApi.simulateWorkflow({
        workflow: { nodes, edges },
      });

      setSimulationState({
        status: response.success ? 'completed' : 'failed',
        completedNodes: response.steps.map(s => s.nodeId),
        results: response.steps.map(s => ({
          nodeId: s.nodeId,
          success: s.status === 'completed',
          output: s.output,
          error: s.error,
          duration: s.duration || 0,
          logs: s.logs,
        })),
        errors: response.errors,
        progress: 100,
      });

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success(
          <div className="max-w-md">
            <div className="flex items-start justify-between gap-2 mb-1">
              <strong className="text-sm">🎉 Simulation Complete!</strong>
              <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="text-xs space-y-1">
              <div>⏱️ Time: {response.totalDuration}ms</div>
              <div>📊 Steps: {response.steps.length}</div>
            </div>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.error(
          <div className="max-w-md">
            <div className="flex items-start justify-between gap-2 mb-1">
              <strong className="text-sm">❌ Simulation Failed</strong>
              <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="text-xs">
              {response.errors.length} steps failed
            </div>
          </div>,
          { duration: 4000 }
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setSimulationState({
        status: 'failed',
        completedNodes: [],
        results: [],
        errors: ['Simulation failed: ' + (error as Error).message],
        progress: 0,
      });
      toast.error(
        <div className="max-w-md">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm">❌ {(error as Error).message}</span>
            <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
          </div>
        </div>,
        { duration: 4000 }
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    if (!workflowName || workflowName.trim() === '' || workflowName === 'Untitled Workflow') {
      toast.error(
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">❌ Enter workflow name first</span>
          <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
        </div>,
        { duration: 3000 }
      );
      return;
    }

    if (nodes.length === 0) {
      toast.error(
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">❌ Add some nodes first</span>
          <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
        </div>,
        { duration: 3000 }
      );
      return;
    }

    const loadingToast = toast.loading('💾 Saving workflow...');
    
    try {
      const response = await mockApi.saveWorkflow({
        name: workflowName,
        description: workflowDescription,
        workflow: { nodes, edges },
        metadata: {},
      });
      
      toast.dismiss(loadingToast);
      toast.success(
        <div className="max-w-md">
          <div className="flex items-start justify-between gap-2 mb-1">
            <strong className="text-sm">✅ Workflow Saved!</strong>
            <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="text-xs">
            <div>📝 {workflowName}</div>
            <div>📌 v{response.version}</div>
          </div>
        </div>,
        { duration: 3000 }
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">❌ Save failed. Try again</span>
          <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
        </div>,
        { duration: 3000 }
      );
    }
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast.error(
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">❌ Canvas is empty</span>
          <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
        </div>,
        { duration: 3000 }
      );
      return;
    }

    const workflowData = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = workflowName.replace(/\s+/g, '_') || 'workflow';
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm">📥 Exported: {filename}.json</span>
        <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
      </div>,
      { duration: 3000 }
    );
  };

  const handleClear = () => {
    if (nodes.length === 0) {
      toast('Canvas is already empty!', {
        icon: 'ℹ️',
        duration: 2000,
      });
      return;
    }

    if (confirm(`⚠️ Warning: The entire workflow will be deleted!\n\n${nodes.length} nodes and ${edges.length} connections will be removed.\n\nAre you sure?`)) {
      clearWorkflow();
      toast.success(
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">🗑️ Cleared ({nodes.length} nodes)</span>
          <button onClick={() => toast.dismiss()} className="text-white/80 hover:text-white">✕</button>
        </div>,
        { duration: 3000 }
      );
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Workflow Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-base sm:text-lg font-semibold border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full sm:w-auto"
            placeholder="Workflow Name"
          />
          <span className="text-xs sm:text-sm text-gray-500">
            {nodes.length} nodes, {edges.length} connections
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={handleValidate}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            title="Validate Workflow"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Validate</span>
          </button>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
            title="Simulate Workflow"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">{isSimulating ? 'Simulating...' : 'Simulate'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            title="Save Workflow"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            title="Export Workflow"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            title="Clear Workflow"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
