"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const websocket_service_1 = __importDefault(require("./services/websocket.service"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Create HTTP server
const server = http_1.default.createServer(app);
// Initialize WebSocket server
const wss = new ws_1.WebSocketServer({ server });
// Initialize WebSocket service
const wsService = new websocket_service_1.default(wss);
// Start server
server.listen(port, () => {
    console.log(`🚀 API server running at http://localhost:${port}`);
    console.log(`🔌 WebSocket server ready`);
});
//# sourceMappingURL=index.js.map