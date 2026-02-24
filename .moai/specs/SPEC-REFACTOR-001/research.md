# Project Research Report: Satang

**Generated**: 2026-02-24
**Project**: Satang (AI-powered knowledge notebook, Google NotebookLM clone)
**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase, Google Gemini

---

## 1. Project Structure Overview

```
satang/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (main)/            # Main application routes
│   │   ├── api/               # API endpoints (17 routes)
│   │   └── shared/            # Shared notebook routes
│   ├── components/            # React components
│   │   ├── chat/             # Chat panel component
│   │   ├── notebook/         # Notebook cards
│   │   ├── settings/         # Settings components
│   │   ├── shared/           # Shared components (nav, etc)
│   │   ├── sources/          # Source management
│   │   ├── studio/           # Studio output modals
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks (6 files)
│   ├── lib/                  # Utilities
│   │   ├── ai/              # AI integrations (Gemini, Nano-Banana)
│   │   ├── supabase/        # Supabase clients and types
│   │   └── utils/           # Helper functions
│   └── proxy.ts              # API proxy
├── supabase/migrations/      # Database migrations (3 files)
├── public/                   # Static assets
└── service_images/           # UX reference screenshots
```

---

## 2. Key Files and Their Purposes

### API Routes (`src/app/api/`)

| File | Purpose | Complexity |
|------|---------|------------|
| `chat/route.ts` | AI chat streaming response | Medium |
| `notebook/suggest-title/route.ts` | AI title generation | Low |
| `sources/upload/route.ts` | File upload handling | Medium |
| `sources/process/route.ts` | Source text extraction | High |
| `studio/slides/route.ts` | Slide generation (background job) | Very High |
| `studio/infographic/route.ts` | Infographic generation | Medium |
| `studio/mindmap/route.ts` | Mindmap generation | Medium |
| `studio/flashcard/route.ts` | Flashcard generation | Medium |
| `studio/quiz/route.ts` | Quiz generation | Medium |
| `studio/report/route.ts` | Report generation | Medium |
| `studio/slides/regenerate/route.ts` | Slide regeneration | Medium |
| `studio/slides/pdf/route.ts` | PDF export | Medium |
| `studio/slides/pptx/route.ts` | PPTX export | Medium |
| `studio/slides/google/route.ts` | Google Slides export | Low |
| `studio/theme-preview/route.ts` | Theme preview | Low |

### Components (`src/components/`)

| File | Purpose | Lines of Code |
|------|---------|---------------|
| `chat/chat-panel.tsx` | Chat interface with streaming | 244 |
| `notebook/notebook-card.tsx` | Notebook display card | ~150 |
| `sources/sources-panel.tsx` | Source list management | ~300 |
| `sources/source-add-modal.tsx` | Add source modal | ~200 |
| `studio/slide-modal.tsx` | Slide viewer/editor | ~400 |
| `studio/infographic-modal.tsx` | Infographic viewer | ~150 |
| `studio/studio-panel.tsx` | Studio outputs list | ~300 |

### Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `use-chat.ts` | Chat message management, streaming |
| `use-notebooks.ts` | Notebook CRUD operations |
| `use-sources.ts` | Source management |
| `use-studio.ts` | Studio output generation |
| `use-notes.ts` | Note management |
| `use-design-themes.ts` | Design theme CRUD |

### AI Integration (`src/lib/ai/`)

| File | Purpose |
|------|---------|
| `gemini.ts` | Google Gemini API client (chat, text, summary) |
| `nano-banana.ts` | Nano-Banana API for image generation (infographic, slides) |

---

## 3. Architectural Patterns Identified

### 3.1 Frontend Architecture

**Pattern**: React Server Components + Client Components hybrid
- App Router with route groups `(auth)` and `(main)`
- Server components for data fetching
- Client components for interactivity (marked with `"use client"`)

**State Management**:
- TanStack React Query for server state
- Zustand for client state (minimal usage)
- React Context via `QueryProvider`

**Data Flow**:
```
User Action → Client Component → API Route → Supabase/AI → Response → React Query Cache Update → UI Re-render
```

### 3.2 Backend Architecture

**Pattern**: Next.js API Routes as BFF (Backend for Frontend)
- API routes act as proxy to Supabase and AI services
- Serverless functions with `after()` for background jobs
- Streaming responses for AI chat

**Background Job Pattern** (src/app/api/studio/slides/route.ts):
```typescript
after(async () => {
  // Long-running image generation
  // Progress updates via Supabase
  // Realtime subscriptions notify client
});
```

### 3.3 Database Schema

**Tables**:
1. `users` - User profiles (linked to Supabase Auth)
2. `notebooks` - Notebook entities
3. `sources` - Source files (PDF, URL, text, etc.)
4. `chat_messages` - Chat history
5. `studio_outputs` - Generated content (slides, infographics, etc.)
6. `notes` - User notes
7. `design_themes` - Custom design themes

**Security**: Row Level Security (RLS) enabled on all tables

### 3.4 Real-time Updates

**Pattern**: Supabase Realtime Subscriptions
- Used in `use-studio.ts` for studio output progress
- Fallback polling at 3-second interval when Realtime unavailable
- Channel: `postgres_changes` on `studio_outputs` table

---

## 4. Code Quality Issues Found

### 4.1 Error Handling

**Issue**: Inconsistent error handling patterns
- Some API routes have try-catch with logging
- Others have minimal error handling
- Generic error messages in many places

**Example** (src/app/api/chat/route.ts:108-114):
```typescript
} catch (error) {
  console.error("Chat error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

**Impact**: Difficult to debug issues, poor UX with generic errors

### 4.2 Type Safety

**Issue**: Excessive use of `any` type
- src/lib/ai/nano-banana.ts:73, 256, 402 - `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

**Impact**: Loss of type safety, potential runtime errors

### 4.3 Code Duplication

**Issue**: Similar patterns across studio API routes
- Each studio route (infographic, mindmap, flashcard, quiz) has similar:
  - Auth check
  - Source fetching
  - Output record creation
  - Background job pattern

**Impact**: Maintenance burden, inconsistent behavior

### 4.4 Magic Numbers

**Issue**: Hardcoded values
- src/app/api/studio/slides/route.ts:261 - `CONCURRENCY_LIMIT = 12`
- src/app/api/studio/slides/route.ts:238 - `MAX_SLIDES = 50`
- src/app/api/studio/slides/route.ts:53 - Refetch interval `3000`ms

**Impact**: Lack of configurability

### 4.5 Complex Functions

**Issue**: High cyclomatic complexity
- src/app/api/studio/slides/route.ts:34-398 - Single 364-line function
- src/lib/ai/nano-banana.ts:161-267 - `generateSlideImage` function

**Impact**: Difficult to test, maintain, and understand

### 4.6 Missing Validation

**Issue**: Limited input validation
- No Zod schemas for API input validation
- Basic checks (e.g., `if (!notebookId)`) but not comprehensive

**Impact**: Potential security issues, unexpected behavior

### 4.7 No Tests

**Issue**: Zero test coverage
- No unit tests
- No integration tests
- No E2E tests

**Impact**: High risk of regressions

---

## 5. Integration Dependencies

### 5.1 Supabase

**Integration Points**:
- Authentication (Google OAuth)
- Database (PostgreSQL)
- Storage (files, generated images)
- Realtime (subscriptions)

**Dependencies**:
- `@supabase/ssr` - Server-side rendering support
- `@supabase/supabase-js` - Client library

### 5.2 Google AI

**Integration Points**:
- Gemini 3 Flash - Chat, text generation
- Gemini 3 Pro Image - Image generation (slides, infographics)

**Dependencies**:
- `@google/genai` - Google GenAI SDK

**API Key**: Environment variable `GEMINI_API_KEY`

### 5.3 Third-Party Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `@tanstack/react-query` | Server state | 5.90.20 |
| `zustand` | Client state | 5.0.11 |
| `react-hook-form` | Form management | 7.71.1 |
| `zod` | Schema validation | 4.3.6 |
| `react-dropzone` | File uploads | 14.4.0 |
| `pptxgenjs` | PPTX generation | 4.0.1 |
| `pdf-lib` | PDF generation | 1.17.1 |
| `pdf-parse` | PDF parsing | 2.4.5 |
| `puppeteer-core` | PDF export (via Chrome) | 24.37.2 |
| `@sparticuz/chromium` | Chromium for Puppeteer | 143.0.4 |

---

## 6. Reference Implementations

### 6.1 Streaming Response Pattern

**Location**: src/app/api/chat/route.ts

**Pattern**: TransformStream for passthrough with DB save on flush
```typescript
const passthrough = new TransformStream<Uint8Array, Uint8Array>({
  transform(chunk, controller) {
    fullContent += decoder.decode(chunk, { stream: true });
    controller.enqueue(chunk);
  },
  async flush() {
    if (fullContent) {
      await supabase.from("chat_messages").insert({...});
    }
  },
});
```

**Used in**: Chat streaming

### 6.2 Background Job Pattern

**Location**: src/app/api/studio/slides/route.ts

**Pattern**: Next.js `after()` for serverless background execution
```typescript
after(async () => {
  // Long-running task
  // Progress updates via Supabase
  // Realtime notifies client
});
```

**Used in**: All studio generation routes

### 6.3 Supabase Realtime Subscription

**Location**: src/hooks/use-studio.ts

**Pattern**: Channel subscription with cleanup
```typescript
useEffect(() => {
  const channel = supabase
    .channel(`studio-outputs:${notebookId}`)
    .on("postgres_changes", {...}, () => {
      queryClient.invalidateQueries(...);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}, [notebookId]);
```

**Used in**: Studio output monitoring

### 6.4 Concurrent Task Execution

**Location**: src/app/api/studio/slides/route.ts

**Pattern**: Worker pool for concurrency limiting
```typescript
async function runWithConcurrency<T>(tasks, limit) {
  // Worker pool implementation
}
const results = await runWithConcurrency(tasks, 12);
```

**Used in**: Parallel slide image generation

---

## 7. Potential Improvement Areas

### 7.1 Architecture

1. **API Layer Abstraction**: Create a service layer to reduce duplication
2. **Error Handling**: Standardize error handling with custom error classes
3. **Validation**: Add Zod schemas for all API inputs
4. **Configuration**: Move magic numbers to config

### 7.2 Code Quality

1. **Testing**: Add unit, integration, and E2E tests
2. **Type Safety**: Remove `any` types, improve TypeScript usage
3. **Code Organization**: Split large functions into smaller units
4. **Documentation**: Add JSDoc comments for public APIs

### 7.3 Performance

1. **Caching**: Add response caching where appropriate
2. **Optimization**: Optimize image generation pipeline
3. **Bundle Size**: Analyze and reduce bundle size

### 7.4 Security

1. **Input Validation**: Comprehensive validation on all inputs
2. **Rate Limiting**: Add rate limiting to API routes
3. **CORS**: Review CORS configuration
4. **Secrets**: Ensure no secrets in code

### 7.5 Developer Experience

1. **Linting**: Stricter ESLint rules
2. **Pre-commit Hooks**: Husky for code quality checks
3. **CI/CD**: Automated testing and deployment
4. **Monitoring**: Error tracking (e.g., Sentry)

---

## 8. Technology Assessment

### Strengths

1. **Modern Stack**: Next.js 16, React 19, TypeScript 5.9
2. **Type Safety**: Good TypeScript usage overall
3. **UI Components**: shadcn/ui for consistent design
4. **State Management**: React Query for server state
5. **Authentication**: Supabase Auth with Google OAuth

### Areas for Improvement

1. **Testing**: No test coverage
2. **Error Handling**: Inconsistent patterns
3. **Code Organization**: Some large files need splitting
4. **Documentation**: Limited inline documentation
5. **Monitoring**: No error tracking or analytics

### Technical Debt

1. **TypeScript `any` usage**: 3+ instances in nano-banana.ts
2. **Long functions**: 364-line function in slides/route.ts
3. **Magic numbers**: Hardcoded values throughout
4. **Code duplication**: Similar patterns in studio routes

---

## Conclusion

Satang is a well-structured project using modern technologies. The codebase demonstrates good understanding of React patterns and Next.js best practices. However, there are clear areas for improvement around testing, error handling, and code organization.

The project would benefit from:
1. A comprehensive testing strategy
2. Standardized error handling
3. API input validation
4. Code refactoring to reduce complexity
5. Better documentation

These improvements would enhance maintainability, reliability, and developer experience.
