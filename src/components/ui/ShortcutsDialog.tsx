import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: ['Ctrl', 'S'], description: 'Save workflow' },
        { keys: ['Ctrl', 'E'], description: 'Export workflow' },
        { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
        { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last action' },
        { keys: ['Ctrl', 'Y'], description: 'Redo last action (alternative)' },
        { keys: ['Ctrl', 'K'], description: 'Show shortcuts' },
        { keys: ['Escape'], description: 'Close dialogs / Deselect node' },
      ],
    },
    {
      category: 'Workflow Actions',
      items: [
        { keys: ['Ctrl', 'V'], description: 'Validate workflow' },
        { keys: ['Ctrl', 'R'], description: 'Simulate workflow' },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Clear workflow' },
      ],
    },
    {
      category: 'Node Operations',
      items: [
        { keys: ['Delete'], description: 'Delete selected node' },
        { keys: ['Backspace'], description: 'Delete selected node' },
        { keys: ['Enter'], description: 'Add selected node type (in palette)' },
        { keys: ['Double Click'], description: 'Add node (desktop)' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', '+'], description: 'Zoom in canvas' },
        { keys: ['Ctrl', '-'], description: 'Zoom out canvas' },
        { keys: ['Ctrl', '0'], description: 'Reset zoom' },
        { keys: ['Space', 'Drag'], description: 'Pan canvas' },
      ],
    },
    {
      category: 'Quick Add Nodes',
      items: [
        { keys: ['Ctrl', '1'], description: 'Add Start node' },
        { keys: ['Ctrl', '2'], description: 'Add Task node' },
        { keys: ['Ctrl', '3'], description: 'Add Approval node' },
        { keys: ['Ctrl', '4'], description: 'Add Automated node' },
        { keys: ['Ctrl', '5'], description: 'Add End node' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center gap-3">
              <Keyboard className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-6">
              {shortcuts.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{item.description}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key, keyIdx) => (
                            <React.Fragment key={keyIdx}>
                              <kbd className="px-3 py-1.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm">
                                {key}
                              </kbd>
                              {keyIdx < item.keys.length - 1 && (
                                <span className="text-gray-400 text-xs mx-1">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Pro Tip:</strong> Press <kbd className="px-2 py-1 text-xs bg-white border border-blue-300 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 text-xs bg-white border border-blue-300 rounded">K</kbd> anytime to view shortcuts
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
