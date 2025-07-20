"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = exports.LLMService = void 0;
const events_1 = require("events");
class LLMService extends events_1.EventEmitter {
    apiKey;
    baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    model;
    constructor() {
        super();
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.model = process.env.DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet';
        console.log('LLMService initialized with API key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT SET');
        if (!this.apiKey) {
            console.warn('⚠️  OPENROUTER_API_KEY is not set - LLM features will be disabled');
        }
    }
    async streamChat(messages, onToken) {
        if (!this.apiKey) {
            // Check if this is a JSON request (for analyzeProject)
            const systemMessage = messages.find(m => m.role === 'system');
            const needsJSON = systemMessage?.content.includes('JSON');
            if (needsJSON) {
                // Return a mock JSON response for project analysis
                const mockJSON = JSON.stringify({
                    projectName: "todo-app",
                    description: "A simple TODO application",
                    files: [
                        { path: "app/page.tsx", description: "Main page with TODO list" },
                        { path: "components/TodoList.tsx", description: "TODO list component" },
                        { path: "components/TodoItem.tsx", description: "Individual TODO item component" },
                        { path: "app/globals.css", description: "Global styles with Tailwind CSS" }
                    ]
                });
                for (const char of mockJSON) {
                    onToken(char);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
                return mockJSON;
            }
            else {
                // Return mock code
                const mockCode = `// Mock generated code - Please set OPENROUTER_API_KEY in .env
export default function Component() {
  return <div>Mock Component</div>;
}`;
                for (const char of mockCode) {
                    onToken(char);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
                return mockCode;
            }
        }
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
                    'X-Title': 'Code Generator App'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    stream: true,
                    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
                    max_tokens: parseInt(process.env.MAX_TOKENS || '4096')
                })
            });
            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.statusText}`);
            }
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            if (!reader) {
                throw new Error('No response body');
            }
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]')
                            continue;
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                fullResponse += content;
                                onToken(content);
                            }
                        }
                        catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
            return fullResponse;
        }
        catch (error) {
            console.error('LLM Service error:', error);
            throw error;
        }
    }
    async analyzeProject(prompt) {
        const messages = [
            {
                role: 'system',
                content: `You are a code generation assistant. When a user describes what they want to build, analyze their requirements and provide a structured plan.
You must respond with a JSON object containing:
1. projectName: A suitable name for the project (kebab-case)
2. description: A brief description of the project
3. files: An array of files to generate, each with:
   - path: The file path (e.g., "app/page.tsx", "components/TodoList.tsx")
   - description: What this file should contain

For a NextJS app with TypeScript and Tailwind CSS, typical files include:
- app/page.tsx (main page)
- app/layout.tsx (root layout)
- app/globals.css (global styles)
- components/* (React components)
- lib/utils.ts (utility functions)
- types/index.ts (TypeScript types)

Only include files that are necessary for the requested functionality.`
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        let response = '';
        await this.streamChat(messages, (token) => {
            response += token;
        });
        try {
            const parsed = JSON.parse(response);
            return {
                projectName: parsed.projectName || 'my-app',
                description: parsed.description || prompt,
                files: parsed.files || []
            };
        }
        catch (error) {
            console.error('Failed to parse project analysis:', error);
            // Fallback for basic projects
            return {
                projectName: 'my-app',
                description: prompt,
                files: [
                    { path: 'app/page.tsx', description: 'Main page component' },
                    { path: 'app/layout.tsx', description: 'Root layout with metadata' },
                    { path: 'app/globals.css', description: 'Global styles with Tailwind CSS' }
                ]
            };
        }
    }
    async generatePRD(prompt) {
        if (!this.apiKey) {
            return {
                projectName: "Mock Counter App",
                description: "A simple counter application built with Next.js",
                features: [
                    "Increment counter button",
                    "Decrement counter button",
                    "Reset counter button",
                    "Display current count",
                    "Persist count in local storage"
                ],
                technicalRequirements: [
                    "Next.js 14 with App Router",
                    "TypeScript for type safety",
                    "Tailwind CSS for styling",
                    "React hooks for state management",
                    "Local storage for persistence"
                ],
                dependencies: []
            };
        }
        const messages = [
            {
                role: 'system',
                content: `You are a Product Requirements Document (PRD) generator. Generate a concise PRD for the requested application.
        
        Return ONLY valid JSON with this structure:
        {
          "projectName": "Application Name",
          "description": "Brief description of the application",
          "features": ["Feature 1", "Feature 2", ...],
          "technicalRequirements": ["Requirement 1", "Requirement 2", ...],
          "dependencies": ["dependency1", "dependency2"] // optional, only if specific packages are needed
        }
        
        Focus on:
        - Clear, actionable features
        - Technical requirements using Next.js, TypeScript, and Tailwind CSS
        - Only include dependencies if specific packages beyond the standard Next.js setup are needed`
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        let response = '';
        await this.streamChat(messages, (token) => {
            response += token;
        });
        try {
            return JSON.parse(response);
        }
        catch (error) {
            console.error('Failed to parse PRD JSON:', error);
            throw new Error('Failed to generate valid PRD');
        }
    }
    async generateCode(filePath, fileDescription, projectAnalysis) {
        const messages = [
            {
                role: 'system',
                content: `You are an expert web developer. Generate clean, production-ready code.
Use NextJS with TypeScript, Tailwind CSS, and modern best practices.
Only return the code without any explanations or markdown formatting.`
            },
            {
                role: 'user',
                content: `Project: ${projectAnalysis.projectName}
Description: ${projectAnalysis.description}

Generate the code for file: ${filePath}
File purpose: ${fileDescription}

Remember:
- Use NextJS 14 App Router conventions
- Use TypeScript
- Use Tailwind CSS for styling
- Return only the code, no explanations`
            }
        ];
        let code = '';
        await this.streamChat(messages, (token) => {
            code += token;
        });
        return code;
    }
}
exports.LLMService = LLMService;
exports.llmService = new LLMService();
//# sourceMappingURL=llm.service.js.map