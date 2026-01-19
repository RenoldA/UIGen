# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, and the AI generates React code that renders in real-time in an iframe preview.

## Commands

```bash
# Initial setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development
npm run dev          # Start dev server with Turbopack on localhost:3000

# Testing
npm test             # Run all tests with Vitest
npm test -- path     # Run specific test file

# Other
npm run lint         # ESLint
npm run build        # Production build
npm run db:reset     # Reset database
```

## Architecture

### Core Data Flow

1. User sends message via `ChatInterface` → `useChat` hook (AI SDK)
2. Request hits `/api/chat/route.ts` with messages + serialized virtual file system
3. AI uses `str_replace_editor` and `file_manager` tools to manipulate files
4. Tool calls stream back to client, `handleToolCall` in `FileSystemContext` updates the VirtualFileSystem
5. `PreviewFrame` watches for file changes, transforms JSX via Babel, creates blob URLs, and renders in sandboxed iframe

### Key Abstractions

**VirtualFileSystem** (`src/lib/file-system.ts`): In-memory file system that maintains a tree structure. All generated code lives here—nothing is written to disk. Serializable for persistence.

**Context Providers** (`src/lib/contexts/`):
- `FileSystemProvider`: Wraps VirtualFileSystem with React state, handles tool call execution
- `ChatProvider`: Wraps AI SDK's `useChat`, connects to FileSystemContext

**AI Tools** (`src/lib/tools/`):
- `str_replace_editor`: create/view/str_replace/insert operations on virtual files
- `file_manager`: rename/delete operations

**JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Uses `@babel/standalone` to transform JSX/TSX to JS. Creates import maps with blob URLs for the preview iframe. Handles CSS extraction and third-party package imports via esm.sh.

**Mock Provider** (`src/lib/provider.ts`): When no `ANTHROPIC_API_KEY` is set, uses `MockLanguageModel` to return static responses for demo purposes.

### Preview System

The `PreviewFrame` generates a self-contained HTML document with:
- Import map pointing blob URLs for local files and esm.sh for dependencies
- Tailwind CSS via CDN
- React 19 loaded from esm.sh
- Error boundary for runtime errors
- Syntax error display for transform failures

### Authentication

JWT-based auth using `jose` library. Sessions stored in HTTP-only cookies. Users can use the app anonymously (work stored in localStorage) or sign up to persist projects in SQLite.

### Database

SQLite with Prisma. Reference `prisma/schema.prisma` anytime you need to understand the structure of data stored in the database. Two models:
- `User`: email/password auth
- `Project`: stores messages (JSON) and virtual file system data (JSON)

## Testing

Tests use Vitest with jsdom. Located in `__tests__` directories alongside source files. React Testing Library for component tests.

## Code Style

- Use comments sparingly. Only comment complex code.
