export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}
export interface Project {
    id: string;
    name: string;
    status: 'initializing' | 'building' | 'ready' | 'error';
    createdAt: Date;
    updatedAt: Date;
}
export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    content?: string;
    children?: FileNode[];
}
export interface TerminalOutput {
    id: string;
    command?: string;
    output: string;
    type: 'command' | 'stdout' | 'stderr';
    timestamp: Date;
}
export interface BuildError {
    message: string;
    file?: string;
    line?: number;
    column?: number;
}
//# sourceMappingURL=types.d.ts.map