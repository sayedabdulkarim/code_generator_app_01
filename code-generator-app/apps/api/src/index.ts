import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});