import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date()
});

export const CreateProjectSchema = z.object({
  prompt: z.string().min(1),
  name: z.string().optional()
});

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('chat'),
    payload: ChatMessageSchema
  }),
  z.object({
    type: z.literal('terminal'),
    payload: z.object({
      output: z.string(),
      outputType: z.enum(['command', 'stdout', 'stderr'])
    })
  }),
  z.object({
    type: z.literal('fileUpdate'),
    payload: z.object({
      path: z.string(),
      content: z.string(),
      action: z.enum(['create', 'update', 'delete'])
    })
  }),
  z.object({
    type: z.literal('projectStatus'),
    payload: z.object({
      status: z.enum(['initializing', 'building', 'ready', 'error']),
      message: z.string().optional()
    })
  })
]);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;