# Quick Start Guide

Get up and running with the HR Workflow Designer in 5 minutes.

## 🚀 Installation

```bash
# Clone or create the project
npm create vite@latest hr-workflow-designer -- --template react-ts
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Create Your First Workflow

### Step 1: Add a Start Node

1. Look at the **left sidebar** (Node Palette)
2. **Drag the green "Start" node** onto the canvas
3. **Click the node** to open the configuration panel on the right
4. Enter a title: "Employee Onboarding"
5. Add metadata (optional):
   - Key: `department`, Value: `Engineering`
   - Key: `startDate`, Value: `2024-01-15`

### Step 2: Add a Task Node

1. **Drag the blue "Task" node** onto the canvas below the Start node
2. **Connect them**: Click and drag from the **bottom handle** of the Start node to the **top handle** of the Task node
3. **Click the Task node** to configure:
   - Title: "Prepare Workspace"
   - Description: "Setup laptop and accounts"
   - Assignee: "it@company.com"
   - Due Date: Select a date
   - Priority: "High"

### Step 3: Add an Automated Node

1. **Drag the purple "Automated" node** onto the canvas
2. **Connect** the Task node to the Automated node
3. **Click the Automated node** to configure:
   - Title: "Send Welcome Email"
   - Select Action: "Send Email"
   - Fill in parameters:
     - To: "newemployee@company.com"
     - Subject: "Welcome to the Team!"
     - Body: "We're excited to have you join us."

### Step 4: Add an Approval Node

1. **Drag the orange "Approval" node** onto the canvas
2. **Connect** the Automated node to the Approval node
3. **Click the Approval node** to configure:
   - Title: "Manager Approval"
   - Approver Role: "Hiring Manager"
   - Check "Require comment with approval"

### Step 5: Add an End Node

1. **Drag the red "End" node** onto the canvas
2. **Connect** the Approval node to the End node
3. **Click the End node** to configure:
   - Title: "Onboarding Complete"
   - Completion Message: "Welcome aboard! Your onboarding is complete."
   - Check "Show workflow summary"

---

## ✅ Validate Your Workflow

1. Click the **"Validate"** button in the toolbar
2. If valid, you'll see: ✅ "Workflow is valid!"
3. If errors exist, you'll see a list of issues to fix

Common validation errors:
- Missing Start node
- Missing End node
- Disconnected nodes
- Empty required fields

---

## ▶️ Simulate Execution

1. Click the **"Simulate"** button in the toolbar
2. Watch the simulation run (takes a few seconds)
3. Review the execution results:
   - Execution ID
   - Step-by-step logs
   - Success/failure status
   - Execution time

---

## 💾 Save Your Workflow

1. Click the **"Save"** button in the toolbar
2. You'll receive:
   - Workflow ID
   - Version number
   - Success message

---

## 📤 Export Your Workflow

1. Click the **"Export"** button in the toolbar
2. A JSON file will download automatically
3. File name: `{workflow-name}.json`

---

## 📥 Import a Workflow

Currently, you can manually load a workflow by:

1. Open the browser console (F12)
2. Run:
```javascript
const workflow = /* paste JSON here */;
useWorkflowStore.getState().loadWorkflow(
  workflow.nodes,
  workflow.edges,
  workflow.name,
  workflow.description
);
```

---

## 🎨 Customize Node Appearance

Nodes are styled with TailwindCSS. To customize:

1. Open `src/components/nodes/BaseNode.tsx`
2. Modify the gradient colors:
```typescript
// Change from green to blue
color="bg-gradient-to-r from-blue-500 to-blue-600"
```

---

## 🔧 Add a New Automation

1. Open `src/services/mockApi.ts`
2. Add to `MOCK_AUTOMATIONS` array:

```typescript
{
  id: 'my_custom_action',
  label: 'My Custom Action',
  description: 'Does something awesome',
  category: 'integration',
  params: [
    {
      name: 'param1',
      type: 'string',
      label: 'Parameter 1',
      required: true,
      placeholder: 'Enter value'
    }
  ]
}
```

3. Refresh the app
4. Your new action appears in the Automated node dropdown

---

## 🐛 Troubleshooting

### Canvas is blank
- Check browser console for errors
- Ensure parent div has explicit height
- Verify React Flow is installed

### Drag & drop not working
- Clear browser cache
- Check that `onDragOver` prevents default
- Verify `reactFlowInstance` is initialized

### Nodes not updating
- Check Zustand store in React DevTools
- Verify `updateNode` is called correctly
- Ensure node IDs are unique

### Validation always fails
- Check node data structure matches types
- Verify all required fields are filled
- Ensure edges have valid source/target

---

## 📚 Next Steps

1. **Read the full documentation**: See `README.md`
2. **Explore examples**: Check `examples/` folder
3. **Review architecture**: Read `ARCHITECTURE.md`
4. **Follow implementation guide**: See `IMPLEMENTATION_GUIDE.md`
5. **Check feature roadmap**: Read `FEATURES.md`

---

## 💡 Tips & Tricks

### Keyboard Shortcuts (Future)
- `Ctrl/Cmd + S`: Save workflow
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Delete`: Delete selected node
- `Escape`: Deselect all

### Best Practices
1. **Name nodes clearly**: Use descriptive titles
2. **Add descriptions**: Help team understand purpose
3. **Set realistic deadlines**: Allow adequate time
4. **Test before deploying**: Always simulate first
5. **Document workflows**: Add comments and notes

### Performance Tips
1. **Limit workflow size**: Keep under 50 nodes
2. **Use auto-layout**: Organize nodes efficiently
3. **Clear unused workflows**: Remove old drafts
4. **Export regularly**: Backup your work

---

## 🆘 Getting Help

- **Documentation**: Check `README.md` and other docs
- **Examples**: Review `examples/` folder
- **Issues**: Report bugs on GitHub
- **Community**: Join our Discord/Slack
- **Email**: support@hrworkflow.com

---

## 🎉 You're Ready!

You've created your first workflow! Now you can:
- Build more complex workflows
- Integrate with real APIs
- Deploy to production
- Share with your team

Happy workflow building! 🚀
