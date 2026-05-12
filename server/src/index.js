require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const connectDB = require('./config/db');
const socketManager = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

async function maybeEnableRedisAdapter() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return;

  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error('Redis pubClient error:', err));
  subClient.on('error', (err) => console.error('Redis subClient error:', err));

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));
  console.log('Socket.io Redis adapter enabled');
}

// Connect DB
connectDB();
maybeEnableRedisAdapter().catch((e) => console.error('Failed to enable Redis adapter:', e));

// Basic API route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Dev-Sync Backend is running' });
});

// Initialize Socket event handlers
socketManager(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
