'use client';

import React from 'react';
import useCanvasStore from '../../store/useCanvasStore';
import { Download, Play, Plus } from 'lucide-react';
import { generateProjectZip } from '../../utils/exportProject';

export default function CanvasHeader({ canvasId }: { canvasId: string }) {
  const { nodes, setNodes } = useCanvasStore();

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { label: type, code: '// Type code here...' },
    };
    const event = new CustomEvent('add-node', { detail: newNode });
    window.dispatchEvent(event);
  };

  const playSimulation = () => {
    // Dispatch a custom event to DiagramCanvas to handle the packet animation
    const event = new CustomEvent('play-simulation');
    window.dispatchEvent(event);
  };

  return (
    <header className="glass-panel px-6 py-4 flex flex-col md:flex-row justify-between items-center z-10 w-full sticky top-0 gap-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gradient">
            Dev-Sync
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-slate-400 font-mono">Workspace: {canvasId}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 items-center">
        <div className="flex bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-inner p-1">
          {['Client', 'Server', 'Database', 'API'].map((type) => (
            <button 
              key={type}
              onClick={() => addNode(type)}
              className="flex items-center gap-1 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-all rounded-lg active:scale-95"
            >
              <Plus size={14} /> {type}
            </button>
          ))}
        </div>
        
        <div className="hidden md:block h-8 w-px bg-slate-700/50 mx-2" />

        <button 
          onClick={playSimulation}
          className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 text-sm font-semibold transition-all flex items-center gap-2 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -translate-x-full skew-x-12" />
          <Play size={16} className="fill-current" /> Simulate Flow
        </button>
        
        <button 
          onClick={() => generateProjectZip(nodes)}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-6 py-2.5 rounded-xl shadow-lg text-sm font-semibold transition-all flex items-center gap-2 active:scale-95"
        >
          <Download size={16} /> Export
        </button>
      </div>
    </header>
  );
}
