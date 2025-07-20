import { WebSocket, WebSocketServer } from 'ws';
import { llmService } from './llm.service';
import { WebSocketMessageSchema } from '@code-generator/shared';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private lastPrompts: Map<string, string> = new Map();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupConnectionHandler();
  }

  private setupConnectionHandler() {
    this.wss.on('connection', (ws: WebSocket) => {
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
        this.lastPrompts.delete(clientId);
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
        case 'startBuild':
          await this.handleStartBuild(clientId, validatedMessage.payload);
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
      // Check if it's a build request
      if (this.isBuildRequest(chatMessage.content)) {
        this.lastPrompts.set(clientId, chatMessage.content);
        console.log(`Detected build request for client ${clientId}: ${chatMessage.content}`);

        // Send typing indicator
        this.sendToClient(clientId, {
          type: 'projectStatus',
          payload: {
            status: 'building',
            message: 'Generating Product Requirements Document...'
          }
        });

        // Generate PRD
        try {
          console.log('Generating PRD for:', chatMessage.content);
          const prd = await llmService.generatePRD(chatMessage.content);
          console.log('PRD generated:', prd);
          
          // Send PRD to client
          this.sendToClient(clientId, {
            type: 'prd',
            payload: prd
          });
          console.log('PRD sent to client');

          // Send ready status
          this.sendToClient(clientId, {
            type: 'projectStatus',
            payload: {
              status: 'ready',
              message: 'PRD generated. Review and click "Start Building" when ready.'
            }
          });
        } catch (error) {
          console.error('PRD generation error:', error);
          this.sendError(clientId, 'Failed to generate PRD');
        }
      } else {
        // Regular chat message - not a build request
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

        // After streaming is complete, send a ready status
        this.sendToClient(clientId, {
          type: 'projectStatus',
          payload: {
            status: 'ready',
            message: 'Ready'
          }
        });
      }
    } catch (error) {
      console.error('Chat handling error:', error);
      this.sendError(clientId, 'Failed to process chat message');
    }
  }

  private isBuildRequest(content: string): boolean {
    const buildKeywords = ['build', 'create', 'make', 'generate', 'develop'];
    const isBuild = buildKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    console.log(`Checking if "${content}" is a build request: ${isBuild}`);
    return isBuild;
  }

  private async handleStartBuild(clientId: string, payload: { prompt: string, prd?: any }) {
    const prompt = this.lastPrompts.get(clientId) || payload.prompt;
    
    if (!prompt) {
      this.sendError(clientId, 'No build request found. Please describe what you want to build first.');
      return;
    }

    console.log(`Starting build process for client ${clientId} with prompt: ${prompt}`);
    await this.startBuildProcess(clientId, prompt, payload.prd);
  }

  private async startBuildProcess(clientId: string, prompt: string, prd?: any) {
    try {
      // Send terminal output
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: '🚀 Starting Next.js app creation...',
          outputType: 'stdout'
        }
      });

      // Update status
      this.sendToClient(clientId, {
        type: 'projectStatus',
        payload: {
          status: 'building',
          message: 'Creating Next.js application...'
        }
      });

      // Use PRD if provided, otherwise analyze the project
      const projectInfo = prd || await llmService.analyzeProject(prompt);
      const projectName = projectInfo.projectName.toLowerCase().replace(/\s+/g, '-');
      
      // Send create-next-app command
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: `$ npx create-next-app@latest ${projectName} --typescript --tailwind --app --no-src-dir --import-alias "@/*"`,
          outputType: 'command'
        }
      });

      // Simulate create-next-app output
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: 'Creating a new Next.js app in ./' + projectName,
          outputType: 'stdout'
        }
      });

      // Create base Next.js structure files
      const baseFiles = [
        { path: 'package.json', content: this.generatePackageJson(projectName, prd?.dependencies) },
        { path: 'tsconfig.json', content: this.generateTsConfig() },
        { path: 'tailwind.config.ts', content: this.generateTailwindConfig() },
        { path: 'postcss.config.js', content: this.generatePostCssConfig() },
        { path: 'next.config.js', content: this.generateNextConfig() },
        { path: '.gitignore', content: this.generateGitignore() },
        { path: 'README.md', content: this.generateReadme(projectInfo) }
      ];

      // Send base file updates
      for (const file of baseFiles) {
        this.sendToClient(clientId, {
          type: 'fileUpdate',
          payload: {
            path: file.path,
            content: file.content,
            action: 'create'
          }
        });
      }

      // Analyze what files need to be generated based on PRD
      const projectAnalysis = await llmService.analyzeProject(prompt);
      
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: `\n📦 Installing dependencies...`,
          outputType: 'stdout'
        }
      });

      // Generate application files based on analysis
      for (const file of projectAnalysis.files) {
        this.sendToClient(clientId, {
          type: 'terminal',
          payload: {
            output: `📄 Generating ${file.path}...`,
            outputType: 'stdout'
          }
        });

        const generatedCode = await llmService.generateCode(
          file.path,
          file.description,
          projectAnalysis
        );

        // Send file update
        this.sendToClient(clientId, {
          type: 'fileUpdate',
          payload: {
            path: file.path,
            content: generatedCode,
            action: 'create'
          }
        });
      }

      // Send npm install simulation
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: '\nadded 327 packages, and audited 328 packages in 12s',
          outputType: 'stdout'
        }
      });

      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: '\n✅ Success! Created ' + projectName,
          outputType: 'stdout'
        }
      });

      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: '\nInside that directory, you can run:',
          outputType: 'stdout'
        }
      });

      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: '\n  npm run dev\n    Starts the development server.',
          outputType: 'stdout'
        }
      });

      this.sendToClient(clientId, {
        type: 'projectStatus',
        payload: {
          status: 'ready',
          message: 'Project created successfully!'
        }
      });

    } catch (error) {
      console.error('Build process error:', error);
      this.sendToClient(clientId, {
        type: 'terminal',
        payload: {
          output: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          outputType: 'stderr'
        }
      });
      
      this.sendError(clientId, 'Failed to generate code');
    }
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

  private generatePackageJson(projectName: string, additionalDeps?: string[]): string {
    const deps = additionalDeps || [];
    return JSON.stringify({
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "next": "14.0.4",
        "react": "^18",
        "react-dom": "^18",
        ...deps.reduce((acc, dep) => ({ ...acc, [dep]: "latest" }), {})
      },
      devDependencies: {
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "autoprefixer": "^10.0.1",
        "eslint": "^8",
        "eslint-config-next": "14.0.4",
        "postcss": "^8",
        "tailwindcss": "^3.3.0",
        "typescript": "^5"
      }
    }, null, 2);
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);
  }

  private generateTailwindConfig(): string {
    return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config`;
  }

  private generatePostCssConfig(): string {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`;
  }

  private generateGitignore(): string {
    return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`;
  }

  private generateReadme(projectInfo: any): string {
    return `# ${projectInfo.projectName}

${projectInfo.description}

## Features

${projectInfo.features ? projectInfo.features.map((f: string) => `- ${f}`).join('\n') : '- Core features coming soon'}

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technical Stack

${projectInfo.technicalRequirements ? projectInfo.technicalRequirements.map((r: string) => `- ${r}`).join('\n') : '- Next.js\n- TypeScript\n- Tailwind CSS'}

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
`;
  }
}

export default WebSocketService;