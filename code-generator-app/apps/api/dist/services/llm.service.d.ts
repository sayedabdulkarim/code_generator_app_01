import { EventEmitter } from 'events';
export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMStreamEvent {
    type: 'token' | 'error' | 'done';
    content?: string;
    error?: string;
}
export declare class LLMService extends EventEmitter {
    private apiKey;
    private baseUrl;
    private model;
    constructor();
    streamChat(messages: LLMMessage[], onToken: (token: string) => void): Promise<string>;
    analyzeProject(prompt: string): Promise<{
        projectName: string;
        description: string;
        files: Array<{
            path: string;
            description: string;
        }>;
    }>;
    generatePRD(prompt: string): Promise<any>;
    generateCode(filePath: string, fileDescription: string, projectAnalysis: any): Promise<string>;
}
export declare const llmService: LLMService;
//# sourceMappingURL=llm.service.d.ts.map