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

export class LLMService extends EventEmitter {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model: string;

  constructor() {
    super();
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.model = process.env.DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet';
    
    if (!this.apiKey) {
      console.warn('⚠️  OPENROUTER_API_KEY is not set - LLM features will be disabled');
    }
  }

  async streamChat(messages: LLMMessage[], onToken: (token: string) => void): Promise<string> {
    if (!this.apiKey) {
      // Simulate a response when no API key is set
      const mockResponse = "I'm a mock response. Please set your OPENROUTER_API_KEY to use real AI responses.";
      for (const char of mockResponse) {
        onToken(char);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return mockResponse;
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
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onToken(content);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('LLM Service error:', error);
      throw error;
    }
  }

  async analyzeProject(prompt: string): Promise<{
    suggestions: string[];
    requirements: string[];
  }> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are a helpful AI assistant that helps users build web applications. 
When a user describes what they want to build, analyze their requirements and provide:
1. A list of specific features and functionalities
2. Technical requirements and dependencies
3. Suggestions for improvements or missing features
Format your response as JSON with "suggestions" and "requirements" arrays.`
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
        suggestions: parsed.suggestions || [],
        requirements: parsed.requirements || []
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        suggestions: [response],
        requirements: []
      };
    }
  }

  async generateCode(projectDescription: string, fileType: string): Promise<string> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `You are an expert web developer. Generate clean, production-ready code.
Use NextJS with TypeScript, Tailwind CSS, and modern best practices.
Only return the code without any explanations or markdown formatting.`
      },
      {
        role: 'user',
        content: `Generate ${fileType} for: ${projectDescription}`
      }
    ];

    let code = '';
    await this.streamChat(messages, (token) => {
      code += token;
    });

    return code;
  }
}

export const llmService = new LLMService();