import React from 'react';
import { Handle, Position } from 'reactflow';
import { LucideIcon } from 'lucide-react';

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
  };
  selected?: boolean;
  icon: LucideIcon;
  color: string;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  selected,
  icon: Icon,
  color,
  showSourceHandle = true,
  showTargetHandle = true,
  children,
}) => {
  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-md border-2 transition-all
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
        hover:shadow-lg min-w-[240px] max-w-[280px]
      `}
    >
      {/* Target Handle */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      {/* Node Header */}
      <div className={`flex items-center gap-3 p-4 rounded-t-xl ${color}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-white truncate">
            {data.label}
          </h3>
        </div>
      </div>

      {/* Node Body */}
      {(data.description || children) && (
        <div className="p-4 space-y-2">
          {data.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {data.description}
            </p>
          )}
          {children}
        </div>
      )}

      {/* Source Handle */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}
    </div>
  );
};
