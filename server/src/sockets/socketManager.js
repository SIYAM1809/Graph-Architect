const Canvas = require('../models/Canvas');

module.exports = (io) => {
  const canvasStateById = new Map();

  const PERSIST_DEBOUNCE_MS = Number(process.env.CANVAS_PERSIST_DEBOUNCE_MS || 1000);
  const PERSIST_MAX_WAIT_MS = Number(process.env.CANVAS_PERSIST_MAX_WAIT_MS || 5000);

  const ensureStateLoaded = async (canvasId) => {
    const existing = canvasStateById.get(canvasId);
    if (existing) return existing;

    let canvas = await Canvas.findOne({ canvasId });
    if (!canvas) {
      canvas = await Canvas.create({ canvasId, revision: 0, nodes: [], edges: [] });
    }

    const state = {
      canvasId,
      revision: typeof canvas.revision === 'number' ? canvas.revision : 0,
      nodes: Array.isArray(canvas.nodes) ? canvas.nodes : [],
      edges: Array.isArray(canvas.edges) ? canvas.edges : [],
      dirty: false,
      persistTimer: null,
      firstDirtyAt: 0,
    };

    canvasStateById.set(canvasId, state);
    return state;
  };

  const schedulePersist = (state) => {
    state.dirty = true;
    const now = Date.now();
    if (!state.firstDirtyAt) state.firstDirtyAt = now;

    if (state.persistTimer) clearTimeout(state.persistTimer);

    const timeSinceFirstDirty = now - state.firstDirtyAt;
    const dueIn = Math.max(
      0,
      Math.min(PERSIST_DEBOUNCE_MS, PERSIST_MAX_WAIT_MS - timeSinceFirstDirty)
    );

    state.persistTimer = setTimeout(async () => {
      state.persistTimer = null;
      if (!state.dirty) return;

      const payload = {
        revision: state.revision,
        nodes: state.nodes,
        edges: state.edges,
      };

      // Persist the latest snapshot (single write), not every mutation
      await Canvas.updateOne(
        { canvasId: state.canvasId },
        { $set: payload },
        { upsert: true }
      );

      state.dirty = false;
      state.firstDirtyAt = 0;
    }, dueIn);
  };

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific canvas room
    socket.on('join-canvas', async (canvasId) => {
      socket.join(canvasId);
      socket.canvasId = canvasId; // Attach canvasId to socket for disconnect tracking
      console.log(`Socket ${socket.id} joined canvas ${canvasId}`);
      
      const state = await ensureStateLoaded(canvasId);
      // Send the current state + revision to the joining user
      socket.emit('canvas-state', { nodes: state.nodes, edges: state.edges, revision: state.revision });
      
      // Notify others in room
      socket.to(canvasId).emit('user-joined', { userId: socket.id });
    });

    // Handle cursor movement
    socket.on('cursor-move', (position) => {
      if (socket.canvasId) {
        // Broadcast to everyone else in the room
        socket.to(socket.canvasId).emit('cursor-update', {
          userId: socket.id,
          position
        });
      }
    });

    // Handle Nodes Update (movement, addition, deletion)
    socket.on('nodes-change', async ({ nodes, baseRevision } = {}) => {
      if (socket.canvasId) {
        const state = await ensureStateLoaded(socket.canvasId);

        // Basic conflict detection: if client is behind, force a resync
        if (typeof baseRevision === 'number' && baseRevision !== state.revision) {
          socket.emit('canvas-resync', { nodes: state.nodes, edges: state.edges, revision: state.revision });
          return;
        }

        if (Array.isArray(nodes)) state.nodes = nodes;
        state.revision += 1;
        socket.to(socket.canvasId).emit('nodes-sync', { nodes: state.nodes, revision: state.revision });
        schedulePersist(state);
      }
    });

    // Handle Edges Update
    socket.on('edges-change', async ({ edges, baseRevision } = {}) => {
      if (socket.canvasId) {
        const state = await ensureStateLoaded(socket.canvasId);

        if (typeof baseRevision === 'number' && baseRevision !== state.revision) {
          socket.emit('canvas-resync', { nodes: state.nodes, edges: state.edges, revision: state.revision });
          return;
        }

        if (Array.isArray(edges)) state.edges = edges;
        state.revision += 1;
        socket.to(socket.canvasId).emit('edges-sync', { edges: state.edges, revision: state.revision });
        schedulePersist(state);
      }
    });

    // Handle Code Editing within a Node
    socket.on('code-change', async ({ nodeId, code, baseRevision } = {}) => {
      if (socket.canvasId) {
        const state = await ensureStateLoaded(socket.canvasId);

        if (typeof baseRevision === 'number' && baseRevision !== state.revision) {
          socket.emit('canvas-resync', { nodes: state.nodes, edges: state.edges, revision: state.revision });
          return;
        }

        state.nodes = (state.nodes || []).map(n => {
          if (n && n.id === nodeId) {
            return { ...n, data: { ...n.data, code } };
          }
          return n;
        });

        state.revision += 1;
        socket.to(socket.canvasId).emit('code-sync', { nodeId, code, revision: state.revision });
        schedulePersist(state);
      }
    });

    // Handle Simulate Flow
    socket.on('simulate-flow', () => {
      console.log(`Received simulate-flow from ${socket.id} for room ${socket.canvasId}`);
      if (socket.canvasId) {
        socket.to(socket.canvasId).emit('simulate-flow');
        console.log(`Broadcasted simulate-flow to room ${socket.canvasId}`);
      } else {
        console.log(`Failed to broadcast: socket.canvasId is missing for ${socket.id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.canvasId) {
        socket.to(socket.canvasId).emit('user-left', { userId: socket.id });
      }
    });
  });
};
