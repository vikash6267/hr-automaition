import type {
  AutomationAction,
  SimulateWorkflowRequest,
  SimulateWorkflowResponse,
  SaveWorkflowRequest,
  SaveWorkflowResponse,
  SimulationStep,
} from '../types/api.types';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Send an email notification to specified recipients',
    category: 'email',
    params: [
      {
        name: 'to',
        type: 'string',
        label: 'Recipient Email',
        required: true,
        placeholder: 'user@example.com',
      },
      {
        name: 'subject',
        type: 'string',
        label: 'Email Subject',
        required: true,
        placeholder: 'Enter subject',
      },
      {
        name: 'body',
        type: 'string',
        label: 'Email Body',
        required: true,
        placeholder: 'Enter message',
      },
      {
        name: 'cc',
        type: 'string',
        label: 'CC',
        required: false,
        placeholder: 'Optional CC recipients',
      },
    ],
  },
  {
    id: 'generate_document',
    label: 'Generate Document',
    description: 'Generate a document from a template',
    category: 'document',
    params: [
      {
        name: 'template',
        type: 'select',
        label: 'Document Template',
        required: true,
        options: [
          { label: 'Offer Letter', value: 'offer_letter' },
          { label: 'Employment Contract', value: 'employment_contract' },
          { label: 'NDA', value: 'nda' },
          { label: 'Onboarding Checklist', value: 'onboarding_checklist' },
        ],
      },
      {
        name: 'recipient',
        type: 'string',
        label: 'Recipient Name',
        required: true,
        placeholder: 'Employee name',
      },
      {
        name: 'format',
        type: 'select',
        label: 'Output Format',
        required: true,
        options: [
          { label: 'PDF', value: 'pdf' },
          { label: 'DOCX', value: 'docx' },
        ],
      },
    ],
  },
  {
    id: 'create_ticket',
    label: 'Create IT Ticket',
    description: 'Create a ticket in the IT support system',
    category: 'integration',
    params: [
      {
        name: 'title',
        type: 'string',
        label: 'Ticket Title',
        required: true,
        placeholder: 'Brief description',
      },
      {
        name: 'priority',
        type: 'select',
        label: 'Priority',
        required: true,
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' },
        ],
      },
      {
        name: 'assignee',
        type: 'string',
        label: 'Assign To',
        required: false,
        placeholder: 'Leave empty for auto-assignment',
      },
    ],
  },
  {
    id: 'send_slack_notification',
    label: 'Send Slack Message',
    description: 'Post a message to a Slack channel',
    category: 'notification',
    params: [
      {
        name: 'channel',
        type: 'select',
        label: 'Channel',
        required: true,
        options: [
          { label: '#hr-notifications', value: 'hr-notifications' },
          { label: '#general', value: 'general' },
          { label: '#onboarding', value: 'onboarding' },
        ],
      },
      {
        name: 'message',
        type: 'string',
        label: 'Message',
        required: true,
        placeholder: 'Enter message',
      },
      {
        name: 'mention',
        type: 'string',
        label: 'Mention User',
        required: false,
        placeholder: '@username',
      },
    ],
  },
  {
    id: 'update_hrms',
    label: 'Update HRMS',
    description: 'Update employee record in HR Management System',
    category: 'integration',
    params: [
      {
        name: 'employeeId',
        type: 'string',
        label: 'Employee ID',
        required: true,
        placeholder: 'EMP-12345',
      },
      {
        name: 'field',
        type: 'select',
        label: 'Field to Update',
        required: true,
        options: [
          { label: 'Status', value: 'status' },
          { label: 'Department', value: 'department' },
          { label: 'Position', value: 'position' },
          { label: 'Manager', value: 'manager' },
        ],
      },
      {
        name: 'value',
        type: 'string',
        label: 'New Value',
        required: true,
        placeholder: 'Enter new value',
      },
    ],
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    description: 'Create a calendar event',
    category: 'integration',
    params: [
      {
        name: 'title',
        type: 'string',
        label: 'Meeting Title',
        required: true,
        placeholder: 'Enter title',
      },
      {
        name: 'attendees',
        type: 'string',
        label: 'Attendees',
        required: true,
        placeholder: 'Comma-separated emails',
      },
      {
        name: 'duration',
        type: 'number',
        label: 'Duration (minutes)',
        required: true,
        validation: { min: 15, max: 480 },
      },
      {
        name: 'description',
        type: 'string',
        label: 'Description',
        required: false,
        placeholder: 'Meeting agenda',
      },
    ],
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API implementation
export const mockApi = {
  // GET /automations
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(300);
    return MOCK_AUTOMATIONS;
  },

  // POST /simulate
  async simulateWorkflow(
    request: SimulateWorkflowRequest
  ): Promise<SimulateWorkflowResponse> {
    await delay(500);

    const { workflow } = request;
    const { nodes, edges } = workflow;

    // Build execution order (topological sort simulation)
    const executionOrder = this.getExecutionOrder(nodes, edges);
    
    const steps: SimulationStep[] = [];
    const startTime = new Date().toISOString();
    let currentTime = Date.now();

    for (const node of executionOrder) {
      const stepStartTime = new Date(currentTime).toISOString();
      const duration = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
      
      await delay(100); // Simulate processing time
      
      currentTime += duration;
      const stepEndTime = new Date(currentTime).toISOString();

      const step: SimulationStep = {
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: node.data.label,
        status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success rate
        startTime: stepStartTime,
        endTime: stepEndTime,
        duration,
        logs: this.generateLogs(node),
        output: this.generateOutput(node),
      };

      if (step.status === 'failed') {
        step.error = `Failed to execute ${node.data.label}: Simulated error`;
      }

      steps.push(step);
    }

    const endTime = new Date(currentTime).toISOString();
    const totalDuration = currentTime - Date.parse(startTime);

    return {
      success: steps.every((s) => s.status === 'completed'),
      executionId: `exec_${Date.now()}`,
      startTime,
      endTime,
      totalDuration,
      steps,
      finalOutput: {
        workflowCompleted: true,
        processedNodes: steps.length,
        summary: 'Workflow simulation completed',
      },
      errors: steps.filter((s) => s.error).map((s) => s.error!),
    };
  },

  // POST /workflows
  async saveWorkflow(_request: SaveWorkflowRequest): Promise<SaveWorkflowResponse> {
    await delay(400);
    
    return {
      id: `wf_${Date.now()}`,
      message: 'Workflow saved successfully',
      version: '1.0.0',
    };
  },

  // Helper: Get execution order (simplified topological sort)
  getExecutionOrder(nodes: any[], edges: any[]): any[] {
    const startNode = nodes.find((n) => n.type === 'start');
    if (!startNode) return nodes;

    const visited = new Set<string>();
    const order: any[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        order.push(node);
        
        // Find outgoing edges
        const outgoing = edges.filter((e) => e.source === nodeId);
        outgoing.forEach((edge) => visit(edge.target));
      }
    };

    visit(startNode.id);
    return order;
  },

  // Helper: Generate mock logs
  generateLogs(node: any): string[] {
    const logs = [
      `[INFO] Starting execution of ${node.data.label}`,
      `[DEBUG] Node type: ${node.type}`,
    ];

    if (node.type === 'task') {
      logs.push(`[INFO] Assigned to: ${node.data.assignee || 'Unassigned'}`);
      logs.push(`[INFO] Due date: ${node.data.dueDate || 'Not set'}`);
    } else if (node.type === 'approval') {
      logs.push(`[INFO] Approver role: ${node.data.approverRole}`);
      logs.push(`[INFO] Waiting for approval...`);
      logs.push(`[SUCCESS] Approval granted`);
    } else if (node.type === 'automated') {
      logs.push(`[INFO] Executing action: ${node.data.actionLabel}`);
      logs.push(`[DEBUG] Parameters: ${JSON.stringify(node.data.parameters)}`);
    }

    logs.push(`[SUCCESS] ${node.data.label} completed successfully`);
    return logs;
  },

  // Helper: Generate mock output
  generateOutput(node: any): any {
    switch (node.type) {
      case 'start':
        return { initialized: true, timestamp: new Date().toISOString() };
      case 'task':
        return { taskId: `task_${Date.now()}`, status: 'completed' };
      case 'approval':
        return { approved: true, approver: 'john.doe@company.com' };
      case 'automated':
        return { actionExecuted: true, result: 'Success' };
      case 'end':
        return { workflowCompleted: true };
      default:
        return {};
    }
  },
};
