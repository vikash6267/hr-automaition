# HR Workflow Designer - Architecture Document

## 🎯 System Overview

A visual workflow builder for HR processes using React Flow, enabling drag-and-drop workflow construction with real-time validation and simulation capabilities.

## 📐 Visual Design Principles (from references)

**Image 1 Analysis:**
- Clean card-based nodes with metrics/status badges
- Dotted connection lines with directional flow
- Compact node design with icon + title + status
- Light background with subtle shadows
- Right-side panel for analytics/metrics

**Image 2 Analysis:**
- Left sidebar navigation
- Central canvas with workflow nodes
- Node cards with icon, title, description, and metric badges
- Rounded corners, clean typography
- Right panel for insights/configuration
- Color-coded status indicators (green, red, orange)

**Our Implementation Style:**
- Card-based nodes with rounded corners (12px)
- Icon + Title + Description layout
- Color-coded node types (Start: green, Task: blue, Approval: orange, Automated: purple, End: red)
- Smooth bezier edges
- Collapsible side panels (left: node palette, right: configuration)
- Metric badges for workflow statistics

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HR Workflow Designer                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌─────────────────────┐  ┌──────────────┐   │
│  │          │  │                     │  │              │   │
│  │  Node    │  │   React Flow        │  │  Config      │   │
│  │  Palette │  │   Canvas            │  │  Panel       │   │
│  │          │  │                     │  │              │   │
│  │  - Start │  │  - Custom Nodes     │  │  - Forms     │   │
│  │  - Task  │  │  - Edge Validation  │  │  - Validation│   │
│  │  - Appr. │  │  - Auto Layout      │  │  - Preview   │   │
│  │  - Auto  │  │  - Selection        │  │              │   │
│  │  - End   │  │                     │  │              │   │
│  │          │  │                     │  │              │   │
│  └──────────┘  └─────────────────────┘  └──────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Workflow Toolbar                          │
│  [Save] [Load] [Validate] [Simulate] [Export] [Clear]       │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Workflow   │    │   Mock API   │    │  Simulation  │
│   State      │◄───┤   Layer      │───►│  Engine      │
│   Manager    │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 📦 Technology Stack

- **React 18+** - UI Framework
- **TypeScript** - Type Safety
- **React Flow 11+** - Visual Workflow Canvas
- **Zustand** - State Management (lightweight, perfect for workflow state)
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - API Layer
- **Vitest** - Testing (optional)

---

## 🗂️ Folder Structure

```
src/
├── components/
│   ├── workflow/
│   │   ├── WorkflowCanvas.tsx          # Main React Flow wrapper
│   │   ├── WorkflowToolbar.tsx         # Top action bar
│   │   ├── NodePalette.tsx             # Left sidebar with draggable nodes
│   │   └── ConfigPanel.tsx             # Right sidebar for node config
│   │
│   ├── nodes/
│   │   ├── BaseNode.tsx                # Shared node wrapper
│   │   ├── StartNode.tsx               # Start node component
│   │   ├── TaskNode.tsx                # Task node component
│   │   ├── ApprovalNode.tsx            # Approval node component
│   │   ├── AutomatedNode.tsx           # Automated action node
│   │   ├── EndNode.tsx                 # End node component
│   │   └── index.ts                    # Node registry
│   │
│   ├── forms/
│   │   ├── StartNodeForm.tsx           # Start node configuration
│   │   ├── TaskNodeForm.tsx            # Task node configuration
│   │   ├── ApprovalNodeForm.tsx        # Approval node configuration
│   │   ├── AutomatedNodeForm.tsx       # Automated node configuration
│   │   ├── EndNodeForm.tsx             # End node configuration
│   │   └── FormField.tsx               # Reusable form components
│   │
│   ├── simulation/
│   │   ├── SimulationPanel.tsx         # Simulation results display
│   │   ├── ExecutionLog.tsx            # Step-by-step execution view
│   │   └── WorkflowValidator.tsx       # Validation feedback UI
│   │
│   └── ui/
│       ├── Button.tsx                  # Reusable button
│       ├── Input.tsx                   # Reusable input
│       ├── Select.tsx                  # Reusable select
│       ├── Badge.tsx                   # Status badges
│       └── Card.tsx                    # Card wrapper
│
├── hooks/
│   ├── useWorkflow.ts                  # Main workflow state hook
│   ├── useNodeConfig.ts                # Node configuration hook
│   ├── useWorkflowValidation.ts        # Validation logic hook
│   ├── useSimulation.ts                # Simulation execution hook
│   └── useAutomations.ts               # Fetch automations from API
│
├── store/
│   └── workflowStore.ts                # Zustand store for workflow state
│
├── types/
│   ├── workflow.types.ts               # Workflow & node interfaces
│   ├── api.types.ts                    # API response types
│   └── simulation.types.ts             # Simulation types
│
├── services/
│   ├── api.ts                          # Axios instance
│   ├── workflowApi.ts                  # Workflow API calls
│   └── mockApi.ts                      # Mock API implementation
│
├── utils/
│   ├── nodeRegistry.ts                 # Node type registration
│   ├── workflowSerializer.ts           # Convert React Flow to JSON
│   ├── workflowValidator.ts            # Validation rules
│   └── layoutEngine.ts                 # Auto-layout algorithm (optional)
│
├── constants/
│   ├── nodeTypes.ts                    # Node type definitions
│   └── edgeRules.ts                    # Edge validation rules
│
└── App.tsx                             # Main app entry
```

---

## 🎨 Component Hierarchy

```
App
└── WorkflowDesigner
    ├── WorkflowToolbar
    │   ├── SaveButton
    │   ├── LoadButton
    │   ├── ValidateButton
    │   ├── SimulateButton
    │   └── ExportButton
    │
    ├── NodePalette (Left Sidebar)
    │   └── DraggableNodeItem[]
    │
    ├── WorkflowCanvas (React Flow)
    │   ├── CustomNodes
    │   │   ├── StartNode
    │   │   ├── TaskNode
    │   │   ├── ApprovalNode
    │   │   ├── AutomatedNode
    │   │   └── EndNode
    │   └── CustomEdges
    │
    ├── ConfigPanel (Right Sidebar)
    │   ├── NodeConfigForm
    │   │   ├── StartNodeForm
    │   │   ├── TaskNodeForm
    │   │   ├── ApprovalNodeForm
    │   │   ├── AutomatedNodeForm
    │   │   └── EndNodeForm
    │   └── WorkflowMetadata
    │
    └── SimulationPanel (Bottom Drawer)
        ├── ExecutionLog
        └── ValidationErrors
```

---

## 🔄 Data Flow

1. **Node Creation:**
   - User drags node from palette → Canvas
   - `onDrop` handler creates node with default data
   - Node added to Zustand store
   - React Flow re-renders

2. **Node Configuration:**
   - User clicks node → `onNodeClick`
   - ConfigPanel opens with node-specific form
   - Form updates → Zustand store updates
   - Node re-renders with new data

3. **Edge Creation:**
   - User connects nodes → `onConnect`
   - Validation rules check edge validity
   - Valid edge added to store
   - Invalid edge rejected with error message

4. **Workflow Simulation:**
   - User clicks "Simulate"
   - Workflow serialized to JSON
   - Validation checks run
   - API call to `/simulate`
   - Results displayed in SimulationPanel

---

## 🔐 Validation Rules

### Node Rules:
- **Start Node:** Must be exactly one, no incoming edges
- **End Node:** Must be at least one, no outgoing edges
- **Task/Approval/Automated:** Must have both incoming and outgoing edges
- **All Nodes:** Must have unique IDs and valid configuration

### Edge Rules:
- No circular dependencies (DAG validation)
- No orphaned nodes (all nodes must be reachable from Start)
- No duplicate edges between same nodes

### Workflow Rules:
- Must have exactly one Start node
- Must have at least one End node
- All nodes must be connected to the main flow
- No infinite loops

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- Setup project structure
- Install dependencies
- Create base components (Button, Input, Card)
- Setup Zustand store
- Create TypeScript interfaces

### Phase 2: React Flow Integration (Week 1-2)
- Implement WorkflowCanvas
- Create custom node components
- Setup drag-and-drop from palette
- Implement edge validation
- Add node selection handling

### Phase 3: Configuration System (Week 2)
- Build ConfigPanel
- Create node-specific forms
- Implement form validation with Zod
- Connect forms to Zustand store
- Add real-time preview

### Phase 4: Mock API & Simulation (Week 3)
- Create mock API layer
- Implement workflow serialization
- Build validation engine
- Create simulation engine
- Display execution logs

### Phase 5: Polish & Features (Week 3-4)
- Add auto-layout
- Implement save/load
- Add export functionality
- Create workflow templates
- Add keyboard shortcuts
- Improve UX/UI

---

## 📊 Performance Considerations

- **Memoization:** Use `React.memo` for node components
- **Virtualization:** For large workflows (100+ nodes)
- **Debouncing:** Form inputs and auto-save
- **Lazy Loading:** Code-split node forms
- **Optimistic Updates:** Immediate UI feedback

---

## 🧪 Testing Strategy

- **Unit Tests:** Validation logic, serialization, utilities
- **Integration Tests:** Workflow state management, API calls
- **E2E Tests:** Full workflow creation and simulation
- **Visual Tests:** Node rendering, layout consistency

---

## 🔮 Future Enhancements

- Real-time collaboration (WebSocket)
- Version control for workflows
- Workflow templates library
- Advanced analytics dashboard
- Role-based access control
- Workflow scheduling
- Integration with external HR systems
- AI-powered workflow suggestions
