import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().transform((str) => new Date(str))
});

export const CreateProjectSchema = z.object({
  prompt: z.string().min(1),
  name: z.string().optional()
});

export const PRDSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  technicalRequirements: z.array(z.string()),
  dependencies: z.array(z.string()).optional()
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
  }),
  z.object({
    type: z.literal('startBuild'),
    payload: z.object({
      prompt: z.string(),
      prd: PRDSchema.optional()
    })
  }),
  z.object({
    type: z.literal('prd'),
    payload: PRDSchema
  })
]);

export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type PRDType = z.infer<typeof PRDSchema>;
export type WebSocketMessageType = z.infer<typeof WebSocketMessageSchema>;