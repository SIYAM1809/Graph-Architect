'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Editor from '@monaco-editor/react';
import useCanvasStore from '../../store/useCanvasStore';

export default function CustomNode({ id, data, isConnectable, selected }: NodeProps) {
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

  const getLanguage = (label: string) => {
    const l = (label || '').toLowerCase();
    if (l === 'database') return 'sql';
    if (l === 'api') return 'json';
    if (l === 'client' || l === 'server') return 'typescript';
    return 'javascript';
  };

  const editorLanguage = getLanguage(data.label);
  
  const getDotColor = (label: string) => {
    const l = (label || '').toLowerCase();
    if (l === 'database') return 'bg-amber-500';
    if (l === 'server') return 'bg-blue-500';
    if (l === 'api') return 'bg-emerald-500';
    return 'bg-purple-500';
  };

  return (
    <div 
      className={`text-slate-50 rounded-2xl min-w-[220px] overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        selected 
          ? 'bg-slate-800/90 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-4 ring-blue-500/20' 
          : 'bg-slate-900/70 border border-slate-700/50 shadow-xl hover:border-slate-600 hover:bg-slate-800/80'
      }`}
      onDoubleClick={onDoubleClick}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-4 h-4 bg-slate-800 border-2 border-blue-400 z-10" />
      
      <div className="bg-slate-950/60 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(data.label)} shadow-sm`} />
          <span className="font-bold text-sm tracking-wide text-slate-200">{data.label || 'Node'}</span>
        </div>
        {isEditing && (
          <button 
            onClick={() => setIsEditing(false)}
            className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition"
          >
            Done
          </button>
        )}
      </div>

      <div className="p-3 min-h-[60px] flex items-center justify-center text-slate-400 text-xs">
        {isEditing ? (
          <div className="nodrag nowheel w-[400px] h-[300px] cursor-text rounded-md overflow-hidden border border-slate-700" onDoubleClick={(e) => e.stopPropagation()}>
            <Editor
              height="100%"
              defaultLanguage={editorLanguage}
              language={editorLanguage}
              theme="vs-dark"
              value={data.code || '// Write some code...'}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', padding: { top: 10 } }}
            />
          </div>
        ) : (
          <div className="text-center font-mono opacity-80 bg-slate-950/30 w-full p-3 rounded-lg border border-slate-800/50">
            {data.code ? `${data.code.substring(0, 40)}...` : 'Double click to edit code'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-4 h-4 bg-slate-800 border-2 border-emerald-400 z-10" />
    </div>
  );
}
