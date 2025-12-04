import { ReactFlowProvider } from 'reactflow';
import { Toaster } from 'react-hot-toast';
import { WorkflowToolbar } from './components/workflow/WorkflowToolbar';
import { NodePalette } from './components/workflow/NodePalette';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { ConfigPanel } from './components/workflow/ConfigPanel';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            maxWidth: '500px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              maxWidth: '600px',
            },
          },
        }}
      />

      {/* Toolbar */}
      <WorkflowToolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <NodePalette />

        {/* Center - Canvas */}
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </div>

        {/* Right Sidebar - Config Panel */}
        <ConfigPanel />
      </div>
    </div>
  );
}

export default App;
