import type { Node, Edge } from 'reactflow';
import type { ValidationResult, ValidationError, WorkflowNodeData } from '../types/workflow.types';

export class WorkflowValidator {
  private nodes: Node<WorkflowNodeData>[];
  private edges: Edge[];
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];

  constructor(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  validate(): ValidationResult {
    this.errors = [];
    this.warnings = [];

    this.validateStartNode();
    this.validateEndNode();
    this.validateNodeConnections();
    this.validateNoOrphanedNodes();
    this.validateNoCycles();
    this.validateNodeData();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  private validateStartNode(): void {
    const startNodes = this.nodes.filter((n) => n.type === 'start');

    if (startNodes.length === 0) {
      this.errors.push({
        type: 'error',
        message: '🟢 Start Node Missing: Every workflow must have exactly one Start node. Drag the green "Start" node from the left panel.',
        code: 'NO_START_NODE',
      });
    } else if (startNodes.length > 1) {
      this.errors.push({
        type: 'error',
        message: `🟢 Multiple Start Nodes: Your workflow has ${startNodes.length} Start nodes. Only one Start node is allowed.`,
        code: 'MULTIPLE_START_NODES',
      });
      startNodes.slice(1).forEach((node) => {
        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `🟢 Extra Start Node "${node.data.label}": Please delete this node. Click on it and press the Delete button.`,
          code: 'DUPLICATE_START_NODE',
        });
      });
    } else {
      // Check if Start node has incoming edges
      const startNode = startNodes[0];
      const incomingEdges = this.edges.filter((e) => e.target === startNode.id);
      
      if (incomingEdges.length > 0) {
        const sourceNodes = incomingEdges.map(e => {
          const source = this.nodes.find(n => n.id === e.source);
          return source ? source.data.label : 'Unknown';
        }).join(', ');
        
        this.errors.push({
          type: 'error',
          nodeId: startNode.id,
          message: `🟢 Start Node "${startNode.data.label}": Cannot have incoming connections. Remove connection from "${sourceNodes}".`,
          code: 'START_NODE_HAS_INCOMING',
        });
      }

      // Check if Start node has outgoing edges
      const outgoingEdges = this.edges.filter((e) => e.source === startNode.id);
      if (outgoingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: startNode.id,
          message: `⚠️ Start Node "${startNode.data.label}": Has no outgoing connections. Connect it to another node.`,
          code: 'START_NODE_NO_OUTGOING',
        });
      }
    }
  }

  private validateEndNode(): void {
    const endNodes = this.nodes.filter((n) => n.type === 'end');

    if (endNodes.length === 0) {
      this.errors.push({
        type: 'error',
        message: '🔴 End Node Missing: Every workflow must have at least one End node. Drag the red "End" node from the left panel.',
        code: 'NO_END_NODE',
      });
    } else {
      endNodes.forEach((endNode) => {
        // Check if End node has outgoing edges
        const outgoingEdges = this.edges.filter((e) => e.source === endNode.id);
        
        if (outgoingEdges.length > 0) {
          const targetNodes = outgoingEdges.map(e => {
            const target = this.nodes.find(n => n.id === e.target);
            return target ? target.data.label : 'Unknown';
          }).join(', ');
          
          this.errors.push({
            type: 'error',
            nodeId: endNode.id,
            message: `🔴 End Node "${endNode.data.label}": Cannot have outgoing connections. Remove connection to "${targetNodes}". End node must be the final step.`,
            code: 'END_NODE_HAS_OUTGOING',
          });
        }

        // Check if End node has incoming edges
        const incomingEdges = this.edges.filter((e) => e.target === endNode.id);
        if (incomingEdges.length === 0) {
          this.warnings.push({
            type: 'warning',
            nodeId: endNode.id,
            message: `⚠️ End Node "${endNode.data.label}": Has no incoming connections. Connect it from a previous node.`,
            code: 'END_NODE_NO_INCOMING',
          });
        }
      });
    }
  }

  private validateNodeConnections(): void {
    const middleNodes = this.nodes.filter(
      (n) => n.type !== 'start' && n.type !== 'end'
    );

    middleNodes.forEach((node) => {
      const incomingEdges = this.edges.filter((e) => e.target === node.id);
      const outgoingEdges = this.edges.filter((e) => e.source === node.id);

      const nodeTypeEmoji = {
        task: '🔵',
        approval: '🟠',
        automated: '🟣',
        start: '🟢',
        end: '🔴',
      }[node.type || 'task'] || '⚪';

      if (incomingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: node.id,
          message: `⚠️ ${nodeTypeEmoji} "${node.data.label}": Has no incoming connections. Connect it from a previous node.`,
          code: 'NODE_NO_INCOMING',
        });
      }

      if (outgoingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: node.id,
          message: `⚠️ ${nodeTypeEmoji} "${node.data.label}": Has no outgoing connections. Connect it to a next node.`,
          code: 'NODE_NO_OUTGOING',
        });
      }
    });
  }

  private validateNoOrphanedNodes(): void {
    if (this.nodes.length === 0) return;

    const startNode = this.nodes.find((n) => n.type === 'start');
    if (!startNode) return;

    const reachable = new Set<string>();
    const queue = [startNode.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (reachable.has(currentId)) continue;
      
      reachable.add(currentId);
      
      const outgoing = this.edges.filter((e) => e.source === currentId);
      outgoing.forEach((edge) => queue.push(edge.target));
    }

    this.nodes.forEach((node) => {
      if (!reachable.has(node.id)) {
        const nodeTypeEmoji = {
          start: '🟢',
          task: '🔵',
          approval: '🟠',
          automated: '🟣',
          end: '🔴',
        }[node.type || 'task'] || '⚪';

        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `❌ ${nodeTypeEmoji} "${node.data.label}": This node is not connected to the Start node. Connect it to the main workflow or delete it.`,
          code: 'ORPHANED_NODE',
        });
      }
    });
  }

  private validateNoCycles(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    let cycleNodes: string[] = [];

    const hasCycle = (nodeId: string, path: string[] = []): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const outgoing = this.edges.filter((e) => e.source === nodeId);
      
      for (const edge of outgoing) {
        if (!visited.has(edge.target)) {
          if (hasCycle(edge.target, [...path])) return true;
        } else if (recursionStack.has(edge.target)) {
          cycleNodes = [...path, edge.target];
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          const cycleNodeNames = cycleNodes
            .map(id => {
              const node = this.nodes.find(n => n.id === id);
              return node ? `"${node.data.label}"` : 'Unknown';
            })
            .join(' → ');

          this.errors.push({
            type: 'error',
            message: `🔄 Circular Loop Detected: Your workflow contains an infinite loop. These nodes form a circle: ${cycleNodeNames}. Remove one connection to break the loop.`,
            code: 'CIRCULAR_DEPENDENCY',
          });
          break;
        }
      }
    }
  }

  private validateNodeData(): void {
    this.nodes.forEach((node) => {
      const data = node.data;

      const nodeTypeEmoji = {
        start: '🟢',
        task: '🔵',
        approval: '🟠',
        automated: '🟣',
        end: '🔴',
      }[node.type || 'task'] || '⚪';

      // Validate common fields
      if (!data.label || data.label.trim() === '') {
        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `❌ ${nodeTypeEmoji} Node: Title is missing. Click the node and enter a title in the right panel.`,
          code: 'MISSING_LABEL',
        });
      }

      // Type-specific validation
      switch (node.type) {
        case 'task':
          if ('assignee' in data && (!data.assignee || data.assignee.trim() === '')) {
            this.warnings.push({
              type: 'warning',
              nodeId: node.id,
              message: `⚠️ 🔵 Task "${data.label}": Assignee is missing. Click the node and enter an email address in the "Assignee" field.`,
              code: 'TASK_NO_ASSIGNEE',
            });
          }
          break;

        case 'approval':
          if ('approverRole' in data && (!data.approverRole || data.approverRole.trim() === '')) {
            this.errors.push({
              type: 'error',
              nodeId: node.id,
              message: `❌ 🟠 Approval "${data.label}": Approver Role is required. Click the node and enter a role (e.g., "Manager", "HR Director").`,
              code: 'APPROVAL_NO_ROLE',
            });
          }
          break;

        case 'automated':
          if ('actionId' in data && !data.actionId) {
            this.errors.push({
              type: 'error',
              nodeId: node.id,
              message: `❌ 🟣 Automated "${data.label}": Action not selected. Click the node and choose an action from the dropdown (e.g., "Send Email", "Generate Document").`,
              code: 'AUTOMATED_NO_ACTION',
            });
          }
          break;

        case 'end':
          if ('endMessage' in data && (!data.endMessage || data.endMessage.trim() === '')) {
            this.warnings.push({
              type: 'warning',
              nodeId: node.id,
              message: `⚠️ 🔴 End "${data.label}": Completion message is missing. Click the node and enter a message in the "Completion Message" field.`,
              code: 'END_NO_MESSAGE',
            });
          }
          break;
      }
    });
  }
}

export const validateWorkflow = (
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult => {
  const validator = new WorkflowValidator(nodes, edges);
  return validator.validate();
};
