"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketMessageSchema = exports.CreateProjectSchema = exports.ChatMessageSchema = void 0;
const zod_1 = require("zod");
exports.ChatMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    role: zod_1.z.enum(['user', 'assistant', 'system']),
    content: zod_1.z.string(),
    timestamp: zod_1.z.date()
});
exports.CreateProjectSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1),
    name: zod_1.z.string().optional()
});
exports.WebSocketMessageSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('chat'),
        payload: exports.ChatMessageSchema
    }),
    zod_1.z.object({
        type: zod_1.z.literal('terminal'),
        payload: zod_1.z.object({
            output: zod_1.z.string(),
            outputType: zod_1.z.enum(['command', 'stdout', 'stderr'])
        })
    }),
    zod_1.z.object({
        type: zod_1.z.literal('fileUpdate'),
        payload: zod_1.z.object({
            path: zod_1.z.string(),
            content: zod_1.z.string(),
            action: zod_1.z.enum(['create', 'update', 'delete'])
        })
    }),
    zod_1.z.object({
        type: zod_1.z.literal('projectStatus'),
        payload: zod_1.z.object({
            status: zod_1.z.enum(['initializing', 'building', 'ready', 'error']),
            message: zod_1.z.string().optional()
        })
    })
]);
//# sourceMappingURL=schemas.js.map