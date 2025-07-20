import { WebSocket, WebSocketServer } from 'ws';
import { llmService } from './llm.service';
import { WebSocketMessageSchema } from '@code-generator/shared';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupConnectionHandler();
  }

  private setupConnectionHandler() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`Client ${clientId} connected`);
      
      // Send initial connection success message
      this.sendToClient(clientId, {
        type: 'projectStatus',
        payload: {
          status: 'ready',
          message: 'Connected to code generator'
        }
      });

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.sendError(clientId, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });
    });
  }

  private async handleMessage(clientId: string, message: any) {
    try {
      const validatedMessage = WebSocketMessageSchema.parse(message);

      switch (validatedMessage.type) {
        case 'chat':
          await this.handleChatMessage(clientId, validatedMessage.payload);
          break;
        case 'terminal':
          // Handle terminal commands
          break;
        case 'fileUpdate':
          // Handle file updates
          break;
        default:
          this.sendError(clientId, 'Unknown message type');
      }
    } catch (error) {
      console.error('Message validation error:', error);
      this.sendError(clientId, 'Invalid message schema');
    }
  }

  private async handleChatMessage(clientId: string, chatMessage: any) {
    try {
      // Send typing indicator
      this.sendToClient(clientId, {
        type: 'projectStatus',
        payload: {
          status: 'building',
          message: 'AI is thinking...'
        }
      });

      // Stream response from LLM
      const messages = [{
        role: 'user' as const,
        content: chatMessage.content
      }];

      let fullResponse = '';
      await llmService.streamChat(messages, (token) => {
        // Send each token as it arrives
        this.sendToClient(clientId, {
          type: 'chat',
          payload: {
            id: Date.now().toString(),
            role: 'assistant',
            content: token,
            timestamp: new Date()
          }
        });
        fullResponse += token;
      });

      // After streaming is complete, analyze if this is a build request
      if (this.isBuildRequest(chatMessage.content)) {
        this.startBuildProcess(clientId, chatMessage.content);
      }

    } catch (error) {
      console.error('Chat handling error:', error);
      this.sendError(clientId, 'Failed to process chat message');
    }
  }

  private isBuildRequest(content: string): boolean {
    const buildKeywords = ['build', 'create', 'make', 'generate', 'develop'];
    return buildKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
  }

  private async startBuildProcess(clientId: string, prompt: string) {
    // Send terminal output
    this.sendToClient(clientId, {
      type: 'terminal',
      payload: {
        output: '🤖 Starting build process...',
        outputType: 'stdout'
      }
    });

    // Simulate file creation
    this.sendToClient(clientId, {
      type: 'fileUpdate',
      payload: {
        path: '/app/page.tsx',
        content: '// Generated code will appear here',
        action: 'create'
      }
    });

    // TODO: Implement actual code generation
  }

  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  private sendError(clientId: string, error: string) {
    this.sendToClient(clientId, {
      type: 'projectStatus',
      payload: {
        status: 'error',
        message: error
      }
    });
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export default WebSocketService;