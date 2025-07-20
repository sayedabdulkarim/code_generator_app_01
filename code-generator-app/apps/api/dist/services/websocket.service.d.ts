import { WebSocketServer } from 'ws';
export declare class WebSocketService {
    private wss;
    private clients;
    private lastPrompts;
    constructor(wss: WebSocketServer);
    private setupConnectionHandler;
    private handleMessage;
    private handleChatMessage;
    private isBuildRequest;
    private handleStartBuild;
    private startBuildProcess;
    private sendToClient;
    private sendError;
    private generateClientId;
    private generatePackageJson;
    private generateTsConfig;
    private generateTailwindConfig;
    private generatePostCssConfig;
    private generateNextConfig;
    private generateGitignore;
    private generateReadme;
}
export default WebSocketService;
//# sourceMappingURL=websocket.service.d.ts.map