import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export type NodeData = {
  label: string;
  code: string;
};

export type CanvasState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  cursors: Record<string, { x: number; y: number; color: string }>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeCode: (nodeId: string, code: string) => void;
  updateCursors: (userId: string, position: { x: number; y: number }) => void;
  removeCursor: (userId: string) => void;
};

const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  cursors: {},
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  updateNodeCode: (nodeId, code) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, code } };
        }
        return node;
      }),
    });
  },
  updateCursors: (userId, position) => {
    // Basic distinct colors for cursors based on string charcode could be done here
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    const colorIndex = userId.charCodeAt(0) % colors.length;
    
    set((state) => ({
      cursors: {
        ...state.cursors,
        [userId]: { ...position, color: colors[colorIndex] }
      }
    }));
  },
  removeCursor: (userId) => {
    set((state) => {
      const newCursors = { ...state.cursors };
      delete newCursors[userId];
      return { cursors: newCursors };
    });
  }
}));

export default useCanvasStore;
