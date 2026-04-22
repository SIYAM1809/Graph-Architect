'use client';

import React from 'react';
import useCanvasStore from '../../store/useCanvasStore';

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
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 w-full shadow-sm">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Dev-Sync
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Workspace ID: {canvasId}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <button 
            onClick={() => addNode('Client')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium transition active:scale-95 border-r border-gray-300"
          >
            + Client
          </button>
          <button 
            onClick={() => addNode('Server')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium transition active:scale-95 border-r border-gray-300"
          >
            + Server
          </button>
          <button 
            onClick={() => addNode('Database')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium transition active:scale-95 border-r border-gray-300"
          >
            + Database
          </button>
          <button 
            onClick={() => addNode('API')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 text-sm font-medium transition active:scale-95"
          >
            + API
          </button>
        </div>
        <button 
          onClick={playSimulation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md text-sm font-semibold transition flex items-center gap-2 active:scale-95"
        >
          <span>▶</span> Simulate Flow
        </button>
      </div>
    </header>
  );
}
