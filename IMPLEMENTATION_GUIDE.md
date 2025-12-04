# Implementation Guide - Step by Step

This guide walks you through implementing the HR Workflow Designer from scratch.

## Phase 1: Foundation Setup (Day 1)

### Step 1.1: Initialize Project

```bash
npm create vite@latest hr-workflow-designer -- --template react-ts
cd hr-workflow-designer
npm install
```

### Step 1.2: Install Dependencies

```bash
npm install reactflow zustand lucide-react axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 1.3: Configure Tailwind

Update `tailwind.config.js`:
```javascript
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 1.4: Create Folder Structure

```bash
mkdir -p src/{components/{workflow,nodes,forms,simulation,ui},hooks,store,types,services,utils,constants}
```

---

## Phase 2: Type Definitions (Day 1)

### Step 2.1: Create Core Types

Create `src/types/workflow.types.ts`:
- Define `NodeType` enum
- Create interfaces for each node data type
- Define `Workflow`, `ValidationError`, `ValidationResult`

### Step 2.2: Create API Types

Create `src/types/api.types.ts`:
- Define `AutomationAction` and `AutomationParam`
- Create request/response interfaces

### Step 2.3: Create Simulation Types

Create `src/types/simulation.types.ts`:
- Define simulation context and state
- Create execution result interfaces

---

## Phase 3: State Management (Day 1-2)

### Step 3.1: Setup Zustand Store

Create `src/store/workflowStore.ts`:

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  // ... other state
  
  // Actions
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  // ... other actions
}

export const useWorkflowStore = create<WorkflowState>()(
  devtools((set) => ({
    // Initial state
    nodes: [],
    edges: [],
    selectedNodeId: null,
    
    // Actions implementation
    setNodes: (nodes) => set({ nodes }),
    addNode: (node) => set((state) => ({ 
      nodes: [...state.nodes, node] 
    })),
    // ... other actions
  }))
);
```

### Step 3.2: Test Store

Create a simple component to test state updates:

```typescript
const TestComponent = () => {
  const { nodes, addNode } = useWorkflowStore();
  
  return (
    <div>
      <button onClick={() => addNode(/* test node */)}>
        Add Node
      </button>
      <div>Nodes: {nodes.length}</div>
    </div>
  );
};
```

---

## Phase 4: Node Components (Day 2)

### Step 4.1: Create BaseNode Component

Create `src/components/nodes/BaseNode.tsx`:

```typescript
interface BaseNodeProps {
  id: string;
  data: { label: string; description?: string };
  selected?: boolean;
  icon: LucideIcon;
  color: string;
  children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data, selected, icon: Icon, color, children
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className={`flex items-center gap-3 p-4 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
        <h3 className="font-semibold text-white">{data.label}</h3>
      </div>
      {children && <div className="p-4">{children}</div>}
    </div>
  );
};
```

### Step 4.2: Create Specific Node Components

For each node type (Start, Task, Approval, Automated, End):

1. Create component file
2. Import BaseNode
3. Add type-specific content
4. Add React Flow handles

Example for StartNode:

```typescript
export const StartNode: React.FC<NodeProps<StartNodeData>> = ({ 
  id, data, selected 
}) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      icon={Play}
      color="bg-gradient-to-r from-green-500 to-green-600"
      showTargetHandle={false}
    >
      {/* Node-specific content */}
    </BaseNode>
  );
};
```

### Step 4.3: Register Node Types

Create `src/components/nodes/index.ts`:

```typescript
export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
```

---

## Phase 5: React Flow Canvas (Day 2-3)

### Step 5.1: Create WorkflowCanvas Component

Create `src/components/workflow/WorkflowCanvas.tsx`:

```typescript
export const WorkflowCanvas: React.FC = () => {
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
  
  const onConnect = useCallback((connection: Connection) => {
    // Add edge logic
  }, []);
  
  const onDrop = useCallback((event: React.DragEvent) => {
    // Handle node drop
  }, []);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
```

### Step 5.2: Implement Drag & Drop

1. Add `onDragStart` to palette items
2. Add `onDragOver` and `onDrop` to canvas
3. Create new node on drop with default data

### Step 5.3: Implement Node Selection

```typescript
const onNodeClick = useCallback((_event, node) => {
  selectNode(node.id);
}, [selectNode]);
```

---

## Phase 6: Node Palette (Day 3)

### Step 6.1: Create NodePalette Component

Create `src/components/workflow/NodePalette.tsx`:

```typescript
const paletteItems = [
  { type: 'start', label: 'Start', icon: Play, color: 'from-green-500' },
  { type: 'task', label: 'Task', icon: CheckSquare, color: 'from-blue-500' },
  // ... other items
];

export const NodePalette: React.FC = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
  };
  
  return (
    <div className="w-64 bg-white border-r p-4">
      {paletteItems.map(item => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          className="cursor-move p-3 border rounded-lg"
        >
          {/* Item content */}
        </div>
      ))}
    </div>
  );
};
```

---

## Phase 7: Configuration Forms (Day 3-4)

### Step 7.1: Create Form Components

For each node type, create a form component:

```typescript
export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ 
  nodeId, data 
}) => {
  const { updateNode } = useWorkflowStore();
  
  const handleChange = (field, value) => {
    updateNode(nodeId, { [field]: value });
  };
  
  return (
    <div className="space-y-4">
      <input
        value={data.label}
        onChange={(e) => handleChange('label', e.target.value)}
        placeholder="Task title"
      />
      {/* Other fields */}
    </div>
  );
};
```

### Step 7.2: Create ConfigPanel Component

Create `src/components/workflow/ConfigPanel.tsx`:

```typescript
export const ConfigPanel: React.FC = () => {
  const { selectedNodeId, nodes } = useWorkflowStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  
  if (!selectedNode) return null;
  
  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start': return <StartNodeForm {...} />;
      case 'task': return <TaskNodeForm {...} />;
      // ... other cases
    }
  };
  
  return (
    <div className="w-96 bg-white border-l">
      <h2>Node Configuration</h2>
      {renderForm()}
    </div>
  );
};
```

---

## Phase 8: Mock API Layer (Day 4)

### Step 8.1: Create Mock API

Create `src/services/mockApi.ts`:

```typescript
const MOCK_AUTOMATIONS = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: [/* ... */]
  },
  // ... other automations
];

export const mockApi = {
  async getAutomations() {
    await delay(300);
    return MOCK_AUTOMATIONS;
  },
  
  async simulateWorkflow(request) {
    await delay(500);
    // Simulate execution
    return {
      success: true,
      executionId: `exec_${Date.now()}`,
      steps: [/* ... */]
    };
  },
  
  async saveWorkflow(request) {
    await delay(400);
    return {
      id: `wf_${Date.now()}`,
      message: 'Workflow saved'
    };
  }
};
```

### Step 8.2: Integrate with AutomatedNodeForm

```typescript
const [automations, setAutomations] = useState([]);

useEffect(() => {
  mockApi.getAutomations().then(setAutomations);
}, []);
```

---

## Phase 9: Validation System (Day 4-5)

### Step 9.1: Create Validator Class

Create `src/utils/workflowValidator.ts`:

```typescript
export class WorkflowValidator {
  private nodes: Node[];
  private edges: Edge[];
  private errors: ValidationError[] = [];
  
  validate(): ValidationResult {
    this.validateStartNode();
    this.validateEndNode();
    this.validateNodeConnections();
    this.validateNoCycles();
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  
  private validateStartNode() {
    const startNodes = this.nodes.filter(n => n.type === 'start');
    if (startNodes.length !== 1) {
      this.errors.push({
        type: 'error',
        message: 'Must have exactly one Start node',
        code: 'INVALID_START_NODE'
      });
    }
  }
  
  // ... other validation methods
}
```

### Step 9.2: Integrate with Toolbar

```typescript
const handleValidate = () => {
  const result = validateWorkflow(nodes, edges);
  setValidationResult(result);
  
  if (result.isValid) {
    alert('✅ Workflow is valid!');
  } else {
    alert(`❌ Errors: ${result.errors.map(e => e.message).join('\n')}`);
  }
};
```

---

## Phase 10: Workflow Toolbar (Day 5)

### Step 10.1: Create Toolbar Component

Create `src/components/workflow/WorkflowToolbar.tsx`:

```typescript
export const WorkflowToolbar: React.FC = () => {
  const { nodes, edges, workflowName } = useWorkflowStore();
  
  const handleValidate = () => { /* ... */ };
  const handleSimulate = async () => { /* ... */ };
  const handleSave = async () => { /* ... */ };
  const handleExport = () => { /* ... */ };
  
  return (
    <div className="bg-white border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <input value={workflowName} /* ... */ />
        <div className="flex gap-2">
          <button onClick={handleValidate}>Validate</button>
          <button onClick={handleSimulate}>Simulate</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </div>
    </div>
  );
};
```

---

## Phase 11: Main App Integration (Day 5)

### Step 11.1: Create App Component

Update `src/App.tsx`:

```typescript
function App() {
  return (
    <div className="h-screen flex flex-col">
      <WorkflowToolbar />
      <div className="flex-1 flex">
        <NodePalette />
        <div className="flex-1">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </div>
        <ConfigPanel />
      </div>
    </div>
  );
}
```

---

## Phase 12: Testing & Polish (Day 6-7)

### Step 12.1: Manual Testing Checklist

- [ ] Drag nodes from palette to canvas
- [ ] Connect nodes with edges
- [ ] Click node to open config panel
- [ ] Update node configuration
- [ ] Validate workflow
- [ ] Simulate workflow execution
- [ ] Save workflow
- [ ] Export workflow as JSON
- [ ] Clear workflow
- [ ] Delete individual nodes

### Step 12.2: Edge Cases

- [ ] Empty workflow validation
- [ ] Single node workflow
- [ ] Disconnected nodes
- [ ] Circular dependencies
- [ ] Multiple start nodes
- [ ] No end nodes

### Step 12.3: UI Polish

- [ ] Add loading states
- [ ] Add error messages
- [ ] Add success notifications
- [ ] Improve hover effects
- [ ] Add keyboard shortcuts
- [ ] Improve mobile responsiveness

---

## Phase 13: Deployment (Day 7)

### Step 13.1: Build for Production

```bash
npm run build
```

### Step 13.2: Test Production Build

```bash
npm run preview
```

### Step 13.3: Deploy

Choose your platform:

**Vercel:**
```bash
vercel
```

**Netlify:**
```bash
netlify deploy --prod
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Troubleshooting

### React Flow not rendering
- Ensure parent has explicit height
- Check ReactFlowProvider wraps canvas
- Verify nodeTypes are registered

### Drag & drop not working
- Check dataTransfer.setData format
- Verify onDragOver prevents default
- Ensure reactFlowInstance is initialized

### State not updating
- Check Zustand store actions
- Verify useWorkflowStore is called correctly
- Use React DevTools to inspect state

### Validation errors
- Check node data structure matches types
- Verify edges have valid source/target
- Ensure node IDs are unique

---

## Next Steps

1. **Add Real API Integration**: Replace mockApi with actual backend
2. **Implement Collaboration**: Add WebSocket for real-time updates
3. **Add Templates**: Create workflow template library
4. **Improve Analytics**: Add execution metrics dashboard
5. **Add Testing**: Write unit and integration tests
6. **Optimize Performance**: Add virtualization for large workflows

---

## Resources

- [React Flow Documentation](https://reactflow.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Estimated Total Time**: 5-7 days for full implementation
**Difficulty Level**: Intermediate to Advanced
**Team Size**: 1-2 developers
