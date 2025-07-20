# Code Generator App - Task Checklist

## 🎯 Project Overview
Build a code generator app similar to same.new using NextJS, Node/Express, LLM integration, and Monaco Editor.

## 📋 Development Tasks

### Phase 1: Foundation Setup ✅
- [x] Initialize monorepo structure
  - [x] Frontend (NextJS app)
  - [x] Backend (Node/Express API)
  - [x] Shared types/utilities
- [x] Set up development environment
  - [ ] Docker configuration
  - [x] Environment variables
  - [ ] Git repository
- [x] Install core dependencies
  - [x] NextJS 14+
  - [x] Tailwind CSS
  - [x] shadcn/ui component library
  - [x] Monaco Editor (@monaco-editor/react)
  - [x] Express server
  - [x] TypeScript configuration
  - [x] react-resizable-panels (for split views)
  - [x] Radix UI icons (lucide-react)

### Phase 2: Backend Infrastructure
- [ ] **Project Management**
  - [ ] Unique project ID generation
  - [ ] Project state persistence
  - [ ] Session management
  - [ ] Cleanup/expiration policies

- [ ] **LLM Integration (OpenRouter)**
  - [ ] Set up OpenRouter API client
  - [ ] Configure environment variables (OPENROUTER_API_KEY)
  - [ ] Implement model selection (claude-3.5-sonnet as default)
  - [ ] Create prompt templates for:
    - [ ] Initial project analysis
    - [ ] Code generation
    - [ ] Error fixing
    - [ ] Dependency management
  - [ ] Implement streaming responses for real-time updates
  - [ ] Add HTTP headers (HTTP-Referer, X-Title)
  - [ ] Error handling for API calls
  - [ ] Rate limiting implementation
  - [ ] Token usage tracking and cost monitoring
  - [ ] Implement retry logic with exponential backoff

- [ ] **Execution Environment**
  - [ ] Research and choose sandboxing solution
    - [ ] Option 1: StackBlitz WebContainers
    - [ ] Option 2: Docker containers
    - [ ] Option 3: Firecracker VMs
  - [ ] Implement file system abstraction
  - [ ] Create workspace isolation per session
  - [ ] Resource limit configuration

- [ ] **Database Setup**
  - [ ] SQLite configuration
  - [ ] Prisma schema design
    - [ ] User sessions
    - [ ] Generated projects
    - [ ] Chat history
    - [ ] Code snapshots
  - [ ] Migration setup

- [x] **Real-time Communication** (Partial)
  - [x] WebSocket server setup
  - [ ] Event handlers for:
    - [ ] Chat messages
    - [ ] Code generation updates
    - [ ] Terminal output streaming
    - [ ] File system changes
  - [ ] Connection management

### Phase 3: Core API Development
- [ ] **Chat Service**
  - [ ] Message processing endpoint
  - [ ] Context management
  - [ ] Suggestion generation logic
  - [ ] Confirmation flow handling

- [ ] **Code Generation Service**
  - [ ] Project initialization logic
  - [ ] Dependency installation handler
  - [ ] File creation/modification APIs
  - [ ] Error detection and recovery
  - [ ] Build process management

- [ ] **Terminal Service**
  - [ ] Command execution API
  - [ ] Output streaming
  - [ ] Error code detection (0/1)
  - [ ] Process management

- [ ] **File System API**
  - [ ] File CRUD operations
  - [ ] Directory management
  - [ ] File watching for changes
  - [ ] Syntax validation

### Phase 4: Frontend Development ✅
- [x] **UI Setup (shadcn/ui)**
  - [x] Initialize shadcn/ui configuration
  - [x] Install required components:
    - [x] Tabs component
    - [x] Toast/Sonner for notifications
    - [ ] Command palette (Cmd+K)
    - [x] Button, Input, Card components
    - [x] Skeleton loaders
    - [x] Dialog/Modal components
    - [ ] Dropdown menu
    - [x] Scroll area
  - [x] Configure theme with CSS variables
  - [ ] Set up dark mode toggle

- [x] **Layout Structure**
  - [x] Responsive split-view layout with react-resizable-panels
  - [ ] Collapsible panels with smooth animations
  - [x] Tab navigation system (shadcn/ui tabs)
  - [ ] Loading states with skeleton components
  - [ ] Full-screen mode toggle
  - [ ] Dark/light theme support with system preference detection
  - [ ] Persistent layout preferences

- [x] **Chat Interface** (Basic)
  - [x] Message input component (shadcn/ui Input + Button)
  - [x] Message history display with ScrollArea
  - [x] Suggestion cards UI (shadcn/ui Card)
  - [ ] Confirmation dialogs (shadcn/ui Dialog)
  - [ ] Markdown rendering with syntax highlighting
  - [x] Loading dots animation for AI responses
  - [ ] Copy code button for code blocks

- [x] **Code Editor Integration** (Basic)
  - [x] Monaco Editor setup
  - [x] Syntax highlighting
  - [x] Multi-file support (basic tabs)
  - [ ] Auto-save functionality
  - [ ] Error highlighting

- [x] **Terminal Component** (Basic)
  - [x] Terminal emulator UI with dark theme
  - [x] Command output display in ScrollArea
  - [ ] ANSI color support (xterm.js or custom)
  - [x] Auto-scroll functionality
  - [ ] Clear/reset options
  - [ ] Copy output functionality
  - [ ] Status indicators (running/success/error)

- [x] **Preview Panel** (Basic)
  - [x] Iframe implementation
  - [ ] Hot reload support
  - [ ] Error boundary
  - [x] Loading states
  - [x] Refresh controls

### Phase 5: Integration & Flow
- [x] **User Flow Implementation** (Partial)
  - [x] Initial chat prompt
  - [ ] Requirement analysis by LLM
  - [ ] Suggestion generation
  - [ ] User confirmation flow
  - [x] Code generation trigger (UI ready)
  - [ ] One-click app generation
  - [ ] Progressive enhancement (start simple, add features)

- [ ] **Error Recovery System**
  - [ ] Terminal error monitoring
  - [ ] Error message extraction
  - [ ] Automatic fix attempts
  - [ ] User notification system
  - [ ] Rollback mechanism

- [ ] **State Management**
  - [ ] Global state setup (Zustand/Redux)
  - [ ] Session persistence
  - [ ] Optimistic updates
  - [ ] Conflict resolution

### Phase 6: LLM Optimization
- [ ] **Prompt Engineering**
  - [ ] Create structured prompts for:
    - [ ] Project analysis
    - [ ] Suggestion generation
    - [ ] Code generation
    - [ ] Error fixing
  - [ ] Context window management
  - [ ] Token optimization

- [ ] **LLM Tools/Functions (OpenRouter)**
  - [ ] Define available actions/tools:
    - [ ] create_file
    - [ ] edit_file
    - [ ] run_command
    - [ ] install_dependency
    - [ ] fix_error
  - [ ] Implement OpenRouter function calling format
  - [ ] Response parsing for tool outputs
  - [ ] Action execution pipeline
  - [ ] Handle streaming tool responses

### Phase 7: Security & Performance
- [ ] **Security Measures**
  - [ ] Input sanitization
  - [ ] API authentication
  - [ ] Resource limits per user
  - [ ] Sandbox escape prevention
  - [ ] Secret management

- [ ] **Performance Optimization**
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Caching strategy
  - [ ] CDN setup
  - [ ] Database indexing

### Phase 8: Testing & Quality
- [ ] **Testing Setup**
  - [ ] Unit tests (Jest)
  - [ ] Integration tests
  - [ ] E2E tests (Playwright)
  - [ ] LLM response mocking

- [ ] **Quality Assurance**
  - [ ] ESLint configuration
  - [ ] Prettier setup
  - [ ] Pre-commit hooks
  - [ ] CI/CD pipeline

### Phase 9: Deployment
- [ ] **Infrastructure Setup**
  - [ ] Production environment
  - [ ] Database hosting
  - [ ] Container orchestration
  - [ ] Load balancing

- [ ] **Monitoring**
  - [ ] Error tracking (Sentry)
  - [ ] Analytics
  - [ ] Performance monitoring
  - [ ] Cost tracking (LLM usage)

### Phase 10: Polish & Launch
- [ ] **User Experience**
  - [ ] Onboarding flow
  - [ ] Help documentation
  - [ ] Example projects
  - [ ] Keyboard shortcuts
  - [ ] Share/export functionality
  - [ ] Project templates gallery
  - [ ] Quick start examples

- [ ] **Final Touches**
  - [ ] Loading animations
  - [ ] Error messages
  - [ ] Success notifications
  - [ ] Responsive design testing

## 🔧 Technical Decisions Needed
- [x] Choose LLM provider: **OpenRouter (with Claude 3.5 Sonnet)**
- [x] Choose UI framework: **Tailwind CSS + shadcn/ui**
- [ ] Select sandboxing technology
- [ ] Decide on authentication method
- [ ] Choose deployment platform
- [ ] Select monitoring tools
- [ ] Model fallback strategy (if Claude is unavailable)
- [ ] Cost limits per user/session

## 📝 Notes
- Focus on MVP features first
- Prioritize security and sandboxing
- Keep the UI simple and intuitive
- Test with various project types
- Monitor LLM costs carefully (OpenRouter pricing)
- **SECURITY**: Never expose API keys in code
- Use .env.local for OPENROUTER_API_KEY
- Add proper error handling for API failures
- Consider implementing request queuing for multiple users

## 🚀 MVP Definition
Minimum features for first release:
1. Basic chat interface
2. Simple todo app generation
3. File viewing/editing
4. Terminal output display
5. Basic error handling
6. Live preview in iframe
7. Auto-fix for common errors
8. Export generated code

---

Last Updated: 2025-07-20

## 🚀 Current Status
### Completed:
- ✅ Monorepo structure with Turbo
- ✅ NextJS frontend with TypeScript
- ✅ Tailwind CSS + shadcn/ui setup
- ✅ Basic UI components (Chat, Editor, Terminal, Preview)
- ✅ Resizable split-panel layout
- ✅ Express backend with WebSocket support
- ✅ Shared types package

### Next Priority:
1. OpenRouter LLM integration
2. WebSocket communication between frontend/backend
3. Sandboxed execution environment
4. File system operations