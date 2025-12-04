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
        message: '🟢 Start Node Missing: Har workflow ko ek Start node chahiye. Left panel se green "Start" node drag karein.',
        code: 'NO_START_NODE',
      });
    } else if (startNodes.length > 1) {
      this.errors.push({
        type: 'error',
        message: `🟢 Multiple Start Nodes: Aapke workflow mein ${startNodes.length} Start nodes hain. Sirf ek Start node hona chahiye.`,
        code: 'MULTIPLE_START_NODES',
      });
      startNodes.slice(1).forEach((node, index) => {
        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `🟢 Extra Start Node "${node.data.label}": Ise delete karein. Canvas pe click karke Delete button dabayein.`,
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
          message: `🟢 Start Node "${startNode.data.label}": Isme incoming connection nahi ho sakta. "${sourceNodes}" se connection remove karein.`,
          code: 'START_NODE_HAS_INCOMING',
        });
      }

      // Check if Start node has outgoing edges
      const outgoingEdges = this.edges.filter((e) => e.source === startNode.id);
      if (outgoingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: startNode.id,
          message: `⚠️ Start Node "${startNode.data.label}": Isko kisi node se connect karein. Neeche wale dot se drag karke dusre node ke upar wale dot tak le jayein.`,
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
        message: '🔴 End Node Missing: Har workflow ko kam se kam ek End node chahiye. Left panel se red "End" node drag karein.',
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
            message: `🔴 End Node "${endNode.data.label}": Isme outgoing connection nahi ho sakta. "${targetNodes}" ke saath connection remove karein. End node workflow ka last step hota hai.`,
            code: 'END_NODE_HAS_OUTGOING',
          });
        }

        // Check if End node has incoming edges
        const incomingEdges = this.edges.filter((e) => e.target === endNode.id);
        if (incomingEdges.length === 0) {
          this.warnings.push({
            type: 'warning',
            nodeId: endNode.id,
            message: `⚠️ End Node "${endNode.data.label}": Isko kisi node se connect karein. Kisi bhi node ke neeche wale dot se drag karke is End node ke upar wale dot tak le jayein.`,
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
      }[node.type] || '⚪';

      if (incomingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: node.id,
          message: `⚠️ ${nodeTypeEmoji} "${node.data.label}": Isme incoming connection nahi hai. Kisi previous node se isko connect karein (upar wale dot pe).`,
          code: 'NODE_NO_INCOMING',
        });
      }

      if (outgoingEdges.length === 0) {
        this.warnings.push({
          type: 'warning',
          nodeId: node.id,
          message: `⚠️ ${nodeTypeEmoji} "${node.data.label}": Isme outgoing connection nahi hai. Isko kisi next node se connect karein (neeche wale dot se).`,
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
        }[node.type] || '⚪';

        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `❌ ${nodeTypeEmoji} "${node.data.label}": Ye node Start node se connected nahi hai. Isko main workflow se connect karein ya delete kar dein.`,
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
            message: `🔄 Circular Loop Detected: Workflow mein infinite loop hai. Ye nodes ek circle bana rahe hain: ${cycleNodeNames}. Ek connection remove karein taaki loop break ho jaye.`,
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
      }[node.type] || '⚪';

      // Validate common fields
      if (!data.label || data.label.trim() === '') {
        this.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `❌ ${nodeTypeEmoji} Node: Title missing hai. Node pe click karke right panel mein title enter karein.`,
          code: 'MISSING_LABEL',
        });
      }

      // Type-specific validation
      switch (node.type) {
        case 'task':
          if (!data.assignee || data.assignee.trim() === '') {
            this.warnings.push({
              type: 'warning',
              nodeId: node.id,
              message: `⚠️ 🔵 Task "${data.label}": Assignee missing hai. Kis ko ye task assign karna hai? Node pe click karke "Assignee" field mein email address enter karein.`,
              code: 'TASK_NO_ASSIGNEE',
            });
          }
          break;

        case 'approval':
          if (!data.approverRole || data.approverRole.trim() === '') {
            this.errors.push({
              type: 'error',
              nodeId: node.id,
              message: `❌ 🟠 Approval "${data.label}": Approver Role missing hai. Kaun approve karega? Node pe click karke "Approver Role" field mein role enter karein (e.g., "Manager", "HR Director").`,
              code: 'APPROVAL_NO_ROLE',
            });
          }
          break;

        case 'automated':
          if (!data.actionId) {
            this.errors.push({
              type: 'error',
              nodeId: node.id,
              message: `❌ 🟣 Automated "${data.label}": Action select nahi kiya gaya. Node pe click karke "Select Action" dropdown se koi action choose karein (e.g., "Send Email", "Generate Document").`,
              code: 'AUTOMATED_NO_ACTION',
            });
          }
          break;

        case 'end':
          if (!data.endMessage || data.endMessage.trim() === '') {
            this.warnings.push({
              type: 'warning',
              nodeId: node.id,
              message: `⚠️ 🔴 End "${data.label}": Completion message missing hai. Workflow complete hone pe kya message dikhana hai? Node pe click karke "Completion Message" field mein message enter karein.`,
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
