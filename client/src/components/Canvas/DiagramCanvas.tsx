'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import ReactFlow, { Background, Controls, EdgeChange, NodeChange, BackgroundVariant, MiniMap, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import useCanvasStore from '../../store/useCanvasStore';
import io, { Socket } from 'socket.io-client';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94a3b8',
  },
};

interface DiagramCanvasProps {
  canvasId: string;
}

export default function DiagramCanvas({ canvasId }: DiagramCanvasProps) {
  const {
    nodes,
    edges,
    cursors,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    updateCursors,
    removeCursor
  } = useCanvasStore();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const revisionRef = useRef<number>(0);

  useEffect(() => {
    // Initialize Socket
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000');
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-canvas', canvasId);
    });

    newSocket.on('canvas-state', (state) => {
      setNodes(state.nodes || []);
      setEdges(state.edges || []);
      revisionRef.current = typeof state.revision === 'number' ? state.revision : 0;
    });

    newSocket.on('canvas-resync', (state) => {
      setNodes(state.nodes || []);
      setEdges(state.edges || []);
      revisionRef.current = typeof state.revision === 'number' ? state.revision : revisionRef.current;
    });

    newSocket.on('cursor-update', ({ userId, position }) => {
      updateCursors(userId, position);
    });

    newSocket.on('user-left', ({ userId }) => {
      removeCursor(userId);
    });

    newSocket.on('nodes-sync', (payload) => {
      const syncedNodes = payload?.nodes ?? payload;
      setNodes(syncedNodes);
      if (typeof payload?.revision === 'number') revisionRef.current = payload.revision;
    });

    newSocket.on('edges-sync', (payload) => {
      const syncedEdges = payload?.edges ?? payload;
      setEdges(syncedEdges);
      if (typeof payload?.revision === 'number') revisionRef.current = payload.revision;
    });

    newSocket.on('code-sync', ({ nodeId, code, revision }) => {
      useCanvasStore.getState().updateNodeCode(nodeId, code);
      if (typeof revision === 'number') revisionRef.current = revision;
    });

    const handlePlay = () => {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    };

    newSocket.on('simulate-flow', () => {
      handlePlay();
    });

    const handlePlaySync = () => {
      handlePlay();
      newSocket.emit('simulate-flow');
    };

    const handleAddNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newNode = customEvent.detail;
      const latestNodes = useCanvasStore.getState().nodes;
      const newNodes = [...latestNodes, newNode];
      setNodes(newNodes);
      newSocket.emit('nodes-change', { nodes: newNodes, baseRevision: revisionRef.current });
    };

    const handleCodeChangeSync = (e: Event) => {
      const { nodeId, code } = (e as CustomEvent).detail;
      newSocket.emit('code-change', { nodeId, code, baseRevision: revisionRef.current });
    };

    window.addEventListener('play-simulation', handlePlaySync);
    window.addEventListener('add-node', handleAddNode);
    window.addEventListener('code-change-sync', handleCodeChangeSync);

    return () => {
      newSocket.disconnect();
      window.removeEventListener('play-simulation', handlePlaySync);
      window.removeEventListener('add-node', handleAddNode);
      window.removeEventListener('code-change-sync', handleCodeChangeSync);
    };
  }, [canvasId, setNodes, setEdges, updateCursors, removeCursor]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!socket || !containerRef.current) return;
    
    // Calculate position relative to container
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    socket.emit('cursor-move', { x, y });
  }, [socket]);

  // Wrap the store's change handlers to emit changes to the server
  const onNodesChangeWithSync = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    if (socket) {
      // Need a slight delay or get the latest nodes to sync
      // Zustand get() is updated synchronously
      setTimeout(() => {
        const latestNodes = useCanvasStore.getState().nodes;
        socket.emit('nodes-change', { nodes: latestNodes, baseRevision: revisionRef.current });
      }, 0);
    }
  }, [onNodesChange, socket]);

  const onEdgesChangeWithSync = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    if (socket) {
      setTimeout(() => {
        const latestEdges = useCanvasStore.getState().edges;
        socket.emit('edges-change', { edges: latestEdges, baseRevision: revisionRef.current });
      }, 0);
    }
  }, [onEdgesChange, socket]);

  const onConnectWithSync = useCallback((connection: import('reactflow').Connection) => {
    onConnect(connection);
    if (socket) {
      setTimeout(() => {
        const latestEdges = useCanvasStore.getState().edges;
        socket.emit('edges-change', { edges: latestEdges, baseRevision: revisionRef.current });
      }, 0);
    }
  }, [onConnect, socket]);

  // Apply animation flag to edges dynamically
  const displayedEdges = React.useMemo(() => {
    return edges.map(edge => {
      const baseEdge = {
        ...edge,
        type: edge.type || 'smoothstep',
        markerEnd: edge.markerEnd || {
          type: MarkerType.ArrowClosed,
          color: isPlaying ? '#3b82f6' : '#94a3b8',
        }
      };
      
      if (!isPlaying) return baseEdge;
      
      return {
        ...baseEdge,
        animated: true,
        style: { ...edge.style, stroke: '#3b82f6', strokeWidth: 2 }
      };
    });
  }, [edges, isPlaying]);

  return (
    <div 
      className="w-full h-screen relative overflow-hidden" 
      ref={containerRef}
      onPointerMove={handlePointerMove}
    >
      <ReactFlow
        nodes={nodes}
        edges={displayedEdges}
        onNodesChange={onNodesChangeWithSync}
        onEdgesChange={onEdgesChangeWithSync}
        onConnect={onConnectWithSync}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background color="#334155" gap={20} size={1.5} variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data?.label?.toLowerCase()) {
              case 'database': return '#f59e0b';
              case 'server': return '#3b82f6';
              case 'api': return '#10b981';
              default: return '#6b7280';
            }
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl"
          maskColor="rgba(2, 6, 23, 0.7)"
        />
      </ReactFlow>

      {/* Render Remote Cursors */}
      {Object.entries(cursors).map(([userId, { x, y, color }]) => (
        <div
          key={userId}
          className="absolute z-50 pointer-events-none transition-all duration-75 flex items-center justify-center"
          style={{ transform: `translate(${x}px, ${y}px)` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={color} className="drop-shadow-md">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
