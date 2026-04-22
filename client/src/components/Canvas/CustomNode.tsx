'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Editor from '@monaco-editor/react';
import useCanvasStore from '../../store/useCanvasStore';

export default function CustomNode({ id, data, isConnectable }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateNodeCode = useCanvasStore((state) => state.updateNodeCode);

  const onDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      updateNodeCode(id, value);
      window.dispatchEvent(new CustomEvent('code-change-sync', { detail: { nodeId: id, code: value } }));
    }
  }, [id, updateNodeCode]);

  return (
    <div 
      className="bg-gray-800 text-white rounded-xl shadow-lg border border-gray-600 min-w-[200px] overflow-hidden"
      onDoubleClick={onDoubleClick}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500" />
      
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <span className="font-semibold text-sm tracking-widest">{data.label || 'Node'}</span>
        {isEditing && (
          <button 
            onClick={() => setIsEditing(false)}
            className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition"
          >
            Close
          </button>
        )}
      </div>

      <div className="p-2 min-h-[50px] flex items-center justify-center text-gray-400 text-xs">
        {isEditing ? (
          <div className="nodrag nowheel w-[400px] h-[300px] cursor-text" onDoubleClick={(e) => e.stopPropagation()}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={data.code || '// Write some code...'}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 12, wordWrap: 'on' }}
            />
          </div>
        ) : (
          <div className="text-center font-mono opacity-60">
            {data.code ? `${data.code.substring(0, 30)}...` : 'Double click to edit code'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
    </div>
  );
}
