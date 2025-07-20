import { z } from 'zod';
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}, {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}>;
export declare const CreateProjectSchema: z.ZodObject<{
    prompt: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    name?: string | undefined;
}, {
    prompt: string;
    name?: string | undefined;
}>;
export declare const WebSocketMessageSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"chat">;
    payload: z.ZodObject<{
        id: z.ZodString;
        role: z.ZodEnum<["user", "assistant", "system"]>;
        content: z.ZodString;
        timestamp: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
    }, {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "chat";
    payload: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
    };
}, {
    type: "chat";
    payload: {
        id: string;
        role: "user" | "assistant" | "system";
        content: string;
        timestamp: Date;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"terminal">;
    payload: z.ZodObject<{
        output: z.ZodString;
        outputType: z.ZodEnum<["command", "stdout", "stderr"]>;
    }, "strip", z.ZodTypeAny, {
        output: string;
        outputType: "command" | "stdout" | "stderr";
    }, {
        output: string;
        outputType: "command" | "stdout" | "stderr";
    }>;
}, "strip", z.ZodTypeAny, {
    type: "terminal";
    payload: {
        output: string;
        outputType: "command" | "stdout" | "stderr";
    };
}, {
    type: "terminal";
    payload: {
        output: string;
        outputType: "command" | "stdout" | "stderr";
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"fileUpdate">;
    payload: z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        action: z.ZodEnum<["create", "update", "delete"]>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        content: string;
        action: "create" | "update" | "delete";
    }, {
        path: string;
        content: string;
        action: "create" | "update" | "delete";
    }>;
}, "strip", z.ZodTypeAny, {
    type: "fileUpdate";
    payload: {
        path: string;
        content: string;
        action: "create" | "update" | "delete";
    };
}, {
    type: "fileUpdate";
    payload: {
        path: string;
        content: string;
        action: "create" | "update" | "delete";
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"projectStatus">;
    payload: z.ZodObject<{
        status: z.ZodEnum<["initializing", "building", "ready", "error"]>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "initializing" | "building" | "ready" | "error";
        message?: string | undefined;
    }, {
        status: "initializing" | "building" | "ready" | "error";
        message?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "projectStatus";
    payload: {
        status: "initializing" | "building" | "ready" | "error";
        message?: string | undefined;
    };
}, {
    type: "projectStatus";
    payload: {
        status: "initializing" | "building" | "ready" | "error";
        message?: string | undefined;
    };
}>]>;
export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type WebSocketMessageType = z.infer<typeof WebSocketMessageSchema>;
//# sourceMappingURL=schemas.d.ts.map