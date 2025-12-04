# HR Workflow Designer

A production-ready visual workflow builder for HR processes using React Flow. Build complex workflows with drag-and-drop nodes, real-time validation, and simulation capabilities.

## 🎯 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows
- **5 Node Types**: Start, Task, Approval, Automated, End
- **Real-time Validation**: Instant feedback on workflow structure
- **Workflow Simulation**: Test workflows before deployment
- **Mock API Integration**: Automated actions with dynamic parameters
- **Export/Import**: Save workflows as JSON
- **Responsive Design**: Clean, modern UI inspired by industry standards

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  HR Workflow Designer                    │
├──────────────┬──────────────────────┬───────────────────┤
│ Node Palette │   React Flow Canvas  │  Config Panel     │
│              │                      │                   │
│ - Start      │  - Custom Nodes      │  - Node Forms     │
│ - Task       │  - Edge Validation   │  - Validation     │
│ - Approval   │  - Auto Layout       │  - Parameters     │
│ - Automated  │  - Selection         │                   │
│ - End        │                      │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

## 📦 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **React Flow 11** - Visual Workflow Canvas
- **Zustand** - State Management
- **React Hot Toast** - Beautiful Notifications
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build Tool

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

### First Workflow

1. **Drag a Start node** from the left palette onto the canvas
2. **Add Task/Approval nodes** to define your workflow steps
3. **Connect nodes** by dragging from one node's handle to another
4. **Click a node** to configure it in the right panel
5. **Add an End node** to complete the workflow
6. **Click Validate** to check for errors (you'll see a toast notification)
7. **Click Simulate** to test execution (watch the toast notifications for progress)
8. **Click Save** to save your workflow

### Toast Notifications

The app uses beautiful toast notifications for all actions:
- ✅ **Success** - Green toast for successful operations
- ❌ **Error** - Red toast with detailed error messages
- ⏳ **Loading** - Animated toast for ongoing operations
- ℹ️ **Info** - Blue toast for informational messages

All alerts have been replaced with user-friendly toast notifications!

## 📐 Node Types

### Start Node
- Entry point for workflows
- Define initial metadata
- No incoming connections allowed

### Task Node
- Manual task assignment
- Configure assignee, due date, priority
- Custom fields support

### Approval Node
- Approval workflow step
- Define approver role
- Auto-approve threshold
- Escalation timeout

### Automated Node
- Execute automated actions
- Dynamic parameter forms
- Integration with external systems

### End Node
- Workflow completion
- Completion message
- User notifications
- Summary display

## 🔧 Configuration

### Node Configuration Forms

Each node type has a dedicated configuration form:

- **StartNodeForm**: Title, description, metadata key-value pairs
- **TaskNodeForm**: Assignee, due date, priority, custom fields
- **ApprovalNodeForm**: Approver role, thresholds, escalation
- **AutomatedNodeForm**: Action selection, dynamic parameters
- **EndNodeForm**: Completion message, notifications, summary

### Validation Rules

- Exactly one Start node required
- At least one End node required
- No circular dependencies (DAG validation)
- No orphaned nodes
- Start node: no incoming edges
- End node: no outgoing edges
- All nodes must be reachable from Start

## 🎨 Customization

### Adding New Node Types

1. Create node component in `src/components/nodes/`
2. Create form component in `src/components/forms/`
3. Add type to `src/types/workflow.types.ts`
4. Register in `src/components/nodes/index.ts`
5. Add to palette in `src/components/workflow/NodePalette.tsx`

### Adding New Automations

Edit `src/services/mockApi.ts` and add to `MOCK_AUTOMATIONS`:

```typescript
{
  id: 'my_action',
  label: 'My Action',
  description: 'Description',
  category: 'integration',
  params: [
    {
      name: 'param1',
      type: 'string',
      label: 'Parameter 1',
      required: true,
    }
  ]
}
```

## 🧪 API Integration

### Mock API Endpoints

```typescript
// GET /automations
const automations = await mockApi.getAutomations();

// POST /simulate
const result = await mockApi.simulateWorkflow({
  workflow: { nodes, edges },
  context: { userId: '123' }
});

// POST /workflows
const saved = await mockApi.saveWorkflow({
  name: 'My Workflow',
  description: 'Description',
  workflow: { nodes, edges },
  metadata: {}
});
```

### Real API Integration

Replace `mockApi` in `src/services/mockApi.ts` with real API calls:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});

export const workflowApi = {
  getAutomations: () => api.get('/automations'),
  simulateWorkflow: (data) => api.post('/simulate', data),
  saveWorkflow: (data) => api.post('/workflows', data),
};
```

## 📊 State Management

Using Zustand for lightweight, performant state management:

```typescript
const { 
  nodes, 
  edges, 
  addNode, 
  updateNode, 
  selectNode 
} = useWorkflowStore();
```

## 🎯 Workflow Validation

```typescript
import { validateWorkflow } from './utils/workflowValidator';

const result = validateWorkflow(nodes, edges);

if (result.isValid) {
  console.log('✅ Workflow is valid');
} else {
  console.log('❌ Errors:', result.errors);
  console.log('⚠️ Warnings:', result.warnings);
}
```

## 🔄 Workflow Simulation

```typescript
const response = await mockApi.simulateWorkflow({
  workflow: { nodes, edges }
});

// Response includes:
// - executionId
// - steps (with logs, duration, output)
// - finalOutput
// - errors
```

## 📤 Export/Import

### Export Workflow

```typescript
const workflowData = {
  name: workflowName,
  description: workflowDescription,
  nodes,
  edges,
  exportedAt: new Date().toISOString()
};

// Download as JSON
const blob = new Blob([JSON.stringify(workflowData, null, 2)]);
```

### Import Workflow

```typescript
const loadWorkflow = (data) => {
  useWorkflowStore.getState().loadWorkflow(
    data.nodes,
    data.edges,
    data.name,
    data.description
  );
};
```

## 🎨 Styling

Using TailwindCSS for utility-first styling:

- **Node Colors**: Gradient backgrounds per node type
- **Responsive**: Adapts to different screen sizes
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment            


### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Example Workflow JSON

```json
{
  "name": "Employee Onboarding",
  "description": "Standard onboarding workflow",
  "nodes": [
    {
      "id": "node_1",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Start Onboarding",
        "metadata": {
          "department": "Engineering",
          "startDate": "2024-01-15"
        }
      }
    },
    {
      "id": "node_2",
      "type": "task",
      "position": { "x": 250, "y": 200 },
      "data": {
        "label": "Prepare Workspace",
        "assignee": "it@company.com",
        "priority": "high",
        "dueDate": "2024-01-14"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2"
    }
  ]
}
```

## 🔮 Roadmap

- [ ] Real-time collaboration (WebSocket)
- [ ] Workflow templates library
- [ ] Advanced analytics dashboard
- [ ] Version control for workflows
- [ ] Role-based access control
- [ ] Workflow scheduling
- [ ] AI-powered suggestions
- [ ] Integration marketplace

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using React Flow
