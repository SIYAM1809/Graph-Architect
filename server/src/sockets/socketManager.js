const Canvas = require('../models/Canvas');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific canvas room
    socket.on('join-canvas', async (canvasId) => {
      socket.join(canvasId);
      socket.canvasId = canvasId; // Attach canvasId to socket for disconnect tracking
      console.log(`Socket ${socket.id} joined canvas ${canvasId}`);
      
      // Load current canvas state from DB
      let canvas = await Canvas.findOne({ canvasId });
      if (!canvas) {
        canvas = await Canvas.create({ canvasId, nodes: [], edges: [] });
      }
      
      // Send the current state to the joining user
      socket.emit('canvas-state', { nodes: canvas.nodes, edges: canvas.edges });
      
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
    socket.on('nodes-change', async (nodes) => {
      if (socket.canvasId) {
        // Broadcast change
        socket.to(socket.canvasId).emit('nodes-sync', nodes);
        // Persist to DB
        await Canvas.findOneAndUpdate({ canvasId: socket.canvasId }, { nodes });
      }
    });

    // Handle Edges Update
    socket.on('edges-change', async (edges) => {
      if (socket.canvasId) {
        socket.to(socket.canvasId).emit('edges-sync', edges);
        await Canvas.findOneAndUpdate({ canvasId: socket.canvasId }, { edges });
      }
    });

    // Handle Code Editing within a Node
    socket.on('code-change', async ({ nodeId, code }) => {
      if (socket.canvasId) {
        socket.to(socket.canvasId).emit('code-sync', { nodeId, code });
        // We'll also update DB by finding the node and updating its data.code
        // Note: For a robust system this might need more specific DB operations
        const canvas = await Canvas.findOne({ canvasId: socket.canvasId });
        if (canvas) {
          const updatedNodes = canvas.nodes.map(n => {
            if (n.id === nodeId) {
              return { ...n, data: { ...n.data, code } };
            }
            return n;
          });
          await Canvas.findOneAndUpdate({ canvasId: socket.canvasId }, { nodes: updatedNodes });
        }
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
