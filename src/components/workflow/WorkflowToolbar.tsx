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
          <div>
            <strong>✅ Workflow Valid!</strong>
            <div className="text-sm mt-2">
              <div className="text-yellow-200 mb-1">⚠️ {result.warnings.length} Warnings:</div>
              {result.warnings.slice(0, 2).map((w, i) => (
                <div key={i} className="text-xs mt-1">• {w.message}</div>
              ))}
              {result.warnings.length > 2 && (
                <div className="text-xs mt-1">• ...aur {result.warnings.length - 2} warnings</div>
              )}
            </div>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success('✅ Perfect! Workflow bilkul sahi hai. Ab Simulate kar sakte hain!', {
          duration: 3000,
        });
      }
    } else {
      toast.error(
        <div>
          <strong>❌ Validation Failed - {result.errors.length} Errors</strong>
          <div className="mt-2 text-sm max-h-48 overflow-y-auto">
            {result.errors.slice(0, 3).map((e, i) => (
              <div key={i} className="mb-2 pb-2 border-b border-red-400/30 last:border-0">
                {e.message}
              </div>
            ))}
            {result.errors.length > 3 && (
              <div className="text-xs mt-2 text-red-200">
                ...aur {result.errors.length - 3} errors hain. Scroll karke dekhen.
              </div>
            )}
          </div>
        </div>,
        { duration: 8000 }
      );
    }
  };

  const handleSimulate = async () => {
    // First validate
    const validationResult = validateWorkflow(nodes, edges);
    setValidationResult(validationResult);

    if (!validationResult.isValid) {
      toast.error(
        <div>
          <strong>❌ Simulation Nahi Chala Sakta</strong>
          <div className="text-sm mt-2">
            Pehle {validationResult.errors.length} errors fix karein:
            <div className="mt-1">
              {validationResult.errors.slice(0, 2).map((e, i) => (
                <div key={i} className="text-xs mt-1">• {e.message}</div>
              ))}
            </div>
          </div>
        </div>,
        { duration: 6000 }
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

    const loadingToast = toast.loading('🔄 Workflow simulate ho raha hai... Thoda wait karein');

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
          <div>
            <strong>🎉 Simulation Successfully Complete!</strong>
            <div className="text-sm mt-2 space-y-1">
              <div>✅ Execution ID: <code className="text-xs">{response.executionId}</code></div>
              <div>⏱️ Total Time: {response.totalDuration}ms</div>
              <div>📊 Steps Completed: {response.steps.length}</div>
              <div className="text-xs text-green-200 mt-2">
                Sab kuch sahi se chala! Production mein deploy kar sakte hain.
              </div>
            </div>
          </div>,
          { duration: 6000 }
        );
      } else {
        toast.error(
          <div>
            <strong>❌ Simulation Failed</strong>
            <div className="text-sm mt-2">
              <div className="mb-2">Kuch steps fail ho gaye:</div>
              {response.errors.slice(0, 2).map((err, i) => (
                <div key={i} className="text-xs mb-1">• {err}</div>
              ))}
              {response.errors.length > 2 && (
                <div className="text-xs mt-1">...aur {response.errors.length - 2} errors</div>
              )}
            </div>
          </div>,
          { duration: 7000 }
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
        <div>
          <strong>❌ Technical Error</strong>
          <div className="text-sm mt-2">
            {(error as Error).message}
            <div className="text-xs mt-2 text-red-200">
              Network issue ho sakta hai. Phir se try karein.
            </div>
          </div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    if (!workflowName || workflowName.trim() === '' || workflowName === 'Untitled Workflow') {
      toast.error(
        <div>
          <strong>❌ Workflow Name Missing</strong>
          <div className="text-sm mt-2">
            Pehle workflow ka naam enter karein (top left mein)
          </div>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    if (nodes.length === 0) {
      toast.error(
        <div>
          <strong>❌ Empty Workflow</strong>
          <div className="text-sm mt-2">
            Pehle kuch nodes add karein. Canvas khali hai!
          </div>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    const loadingToast = toast.loading('💾 Workflow save ho raha hai...');
    
    try {
      const response = await mockApi.saveWorkflow({
        name: workflowName,
        description: workflowDescription,
        workflow: { nodes, edges },
        metadata: {},
      });
      
      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <strong>✅ Workflow Successfully Saved!</strong>
          <div className="text-sm mt-2 space-y-1">
            <div>📝 Name: <strong>{workflowName}</strong></div>
            <div>🆔 ID: <code className="text-xs">{response.id}</code></div>
            <div>📌 Version: {response.version}</div>
            <div className="text-xs text-green-200 mt-2">
              Aap ab ise production mein use kar sakte hain!
            </div>
          </div>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        <div>
          <strong>❌ Save Failed</strong>
          <div className="text-sm mt-2">
            {(error as Error).message}
            <div className="text-xs mt-2 text-red-200">
              Server issue ho sakta hai. Phir se try karein.
            </div>
          </div>
        </div>,
        { duration: 5000 }
      );
    }
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast.error(
        <div>
          <strong>❌ Cannot Export</strong>
          <div className="text-sm mt-2">
            Canvas khali hai! Pehle workflow banayein.
          </div>
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
      <div>
        <strong>📥 Export Successful!</strong>
        <div className="text-sm mt-2">
          File download ho gayi: <strong>{filename}.json</strong>
          <div className="text-xs text-green-200 mt-1">
            Ise backup ke liye save kar lein!
          </div>
        </div>
      </div>,
      { duration: 4000 }
    );
  };

  const handleClear = () => {
    if (nodes.length === 0) {
      toast('Canvas already khali hai!', {
        icon: 'ℹ️',
        duration: 2000,
      });
      return;
    }

    if (confirm(`⚠️ Warning: Pura workflow delete ho jayega!\n\n${nodes.length} nodes aur ${edges.length} connections delete honge.\n\nKya aap sure hain?`)) {
      clearWorkflow();
      toast.success(
        <div>
          <strong>🗑️ Workflow Cleared!</strong>
          <div className="text-sm mt-2">
            {nodes.length} nodes aur {edges.length} connections delete ho gaye.
            <div className="text-xs text-green-200 mt-1">
              Ab nayi workflow bana sakte hain!
            </div>
          </div>
        </div>,
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Workflow Name */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-semibold border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
            placeholder="Workflow Name"
          />
          <span className="text-sm text-gray-500">
            {nodes.length} nodes, {edges.length} connections
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Validate
          </button>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isSimulating ? 'Simulating...' : 'Simulate'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
