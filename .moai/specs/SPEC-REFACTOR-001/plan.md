# Implementation Plan: 프로젝트 개선 및 리팩토링

---
spec_id: SPEC-REFACTOR-001
version: 1.0.0
development_mode: ddd
traceability_tags: [SPEC-REFACTOR-001]
---

## 1. IMPLEMENTATION OVERVIEW

### 1.1 목표

Satang 프로젝트의 코드 품질, 유지보수성, 테스트 커버리지를 개선하여 TRUST 5 품질 표준을 달성한다.

### 1.2 범위

| 포함 | 제외 |
|------|------|
| 에러 처리 표준화 | 새로운 기능 추가 |
| 타입 안전성 개선 | UI/UX 변경 |
| 테스트 인프라 구축 | 데이터베이스 스키마 변경 |
| 코드 리팩토링 | 외부 API 통합 추가 |
| 입력 검증 추가 | 성능 최적화 (선택적) |

### 1.3 DDD 접근 방식

이 SPEC은 Domain-Driven Development (ANALYZE-PRESERVE-IMPROVE) 방식으로 구현된다.

**선택 이유:**
- 기존 프로젝트 (Brownfield)
- 테스트 커버리지 0%
- 기존 동작 보존이 중요

---

## 2. MILESTONES

### Priority 1: 테스트 인프라 및 검증 (필수)

| 마일스톤 | 설명 | 의존성 |
|----------|------|--------|
| M1.1 | 테스트 프레임워크 설정 | 없음 |
| M1.2 | Vitest + React Testing Library 구성 | M1.1 |
| M1.3 | Playwright E2E 테스트 설정 | M1.1 |
| M1.4 | 테스트 유틸리티 및 픽스처 작성 | M1.2 |

### Priority 2: 에러 처리 표준화 (필수)

| 마일스톤 | 설명 | 의존성 |
|----------|------|--------|
| M2.1 | 커스텀 에러 클래스 구현 | 없음 |
| M2.2 | 표준 에러 응답 형식 정의 | M2.1 |
| M2.3 | 에러 처리 미들웨어 구현 | M2.2 |
| M2.4 | 모든 API 라우트에 적용 | M2.3 |

### Priority 3: 입력 검증 (필수)

| 마일스톤 | 설명 | 의존성 |
|----------|------|--------|
| M3.1 | Zod 스키마 정의 (공통 타입) | 없음 |
| M3.2 | API 라우트별 스키마 작성 | M3.1 |
| M3.3 | 검증 미들웨어 구현 | M3.1 |
| M3.4 | 모든 API 라우트에 적용 | M3.2, M3.3 |

### Priority 4: 코드 리팩토링 (필수)

| 마일스톤 | 설명 | 의존성 |
|----------|------|--------|
| M4.1 | `any` 타입 제거 | M1.4 (테스트) |
| M4.2 | `slides/route.ts` 함수 분할 | M1.4, M4.1 |
| M4.3 | 매직 넘버 설정화 | 없음 |
| M4.4 | 스튜디오 라우트 코드 중복 제거 | M2.4, M3.4 |

### Priority 5: 문서화 및 마무리 (권장)

| 마일스톤 | 설명 | 의존성 |
|----------|------|--------|
| M5.1 | JSDoc 주석 추가 | M4.4 |
| M5.2 | API 문서 업데이트 | M5.1 |
| M5.3 | README 업데이트 | M5.2 |

---

## 3. TECHNICAL APPROACH

### 3.1 테스트 인프라

**Vitest 설정:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    }
  }
})
```

**Playwright 설정:**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
})
```

### 3.2 에러 처리 아키텍처

**커스텀 에러 클래스:**
```typescript
// src/lib/errors/index.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('AUTH_ERROR', message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}
```

**에러 핸들러:**
```typescript
// src/lib/errors/handler.ts
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.statusCode }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
    { status: 500 }
  );
}
```

### 3.3 입력 검증 아키텍처

**Zod 스키마 구조:**
```typescript
// src/lib/validations/common.ts
import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const notebookIdSchema = uuidSchema;

// src/lib/validations/chat.ts
export const chatRequestSchema = z.object({
  notebookId: notebookIdSchema,
  message: z.string().min(1).max(4000),
});

// src/lib/validations/studio.ts
export const studioRequestSchema = z.object({
  notebookId: notebookIdSchema,
  sourceIds: z.array(uuidSchema).min(1).max(50),
  options: z.record(z.unknown()).optional(),
});
```

**검증 유틸리티:**
```typescript
// src/lib/validations/utils.ts
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError('Invalid input', result.error.flatten());
  }
  return result.data;
}
```

### 3.4 코드 리팩토링 전략

**`slides/route.ts` 분할:**
```
src/app/api/studio/slides/
├── route.ts              # 메인 핸들러 (간소화)
├── services/
│   ├── slide-generator.ts    # 슬라이드 생성 로직
│   ├── image-generator.ts    # 이미지 생성 로직
│   └── progress-tracker.ts   # 진행 상황 추적
├── utils/
│   ├── concurrency.ts        # 동시성 제어
│   └── slide-parser.ts       # 슬라이드 파싱
└── types.ts                  # 타입 정의
```

**매직 넘버 설정화:**
```typescript
// src/lib/config/studio.ts
export const studioConfig = {
  maxSlides: parseInt(process.env.MAX_SLIDES || '50'),
  concurrencyLimit: parseInt(process.env.CONCURRENCY_LIMIT || '12'),
  refetchInterval: parseInt(process.env.REFETCH_INTERVAL || '3000'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
} as const;
```

---

## 4. FILE MODIFICATION PLAN

### 4.1 신규 생성 파일

| 파일 경로 | 설명 |
|-----------|------|
| `vitest.config.ts` | Vitest 설정 |
| `playwright.config.ts` | Playwright 설정 |
| `src/test/setup.ts` | 테스트 셋업 |
| `src/lib/errors/index.ts` | 커스텀 에러 클래스 |
| `src/lib/errors/handler.ts` | 에러 핸들러 |
| `src/lib/validations/index.ts` | 검증 스키마 exports |
| `src/lib/validations/common.ts` | 공통 스키마 |
| `src/lib/validations/chat.ts` | 챗 관련 스키마 |
| `src/lib/validations/studio.ts` | 스튜디오 관련 스키마 |
| `src/lib/validations/sources.ts` | 소스 관련 스키마 |
| `src/lib/config/studio.ts` | 스튜디오 설정 |
| `src/lib/config/index.ts` | 설정 exports |

### 4.2 수정 필요 파일

| 파일 경로 | 수정 내용 |
|-----------|----------|
| `src/lib/ai/nano-banana.ts` | `any` 타입 제거 |
| `src/app/api/chat/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/sources/upload/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/sources/process/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/studio/slides/route.ts` | 함수 분할, 검증 적용 |
| `src/app/api/studio/infographic/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/studio/mindmap/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/studio/flashcard/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/studio/quiz/route.ts` | 검증, 에러 처리 적용 |
| `src/app/api/studio/report/route.ts` | 검증, 에러 처리 적용 |

### 4.3 테스트 파일

| 파일 경로 | 설명 |
|-----------|------|
| `src/lib/errors/__tests__/errors.test.ts` | 에러 클래스 테스트 |
| `src/lib/validations/__tests__/schemas.test.ts` | 스키마 테스트 |
| `src/app/api/chat/__tests__/route.test.ts` | 챗 API 테스트 |
| `src/app/api/studio/slides/__tests__/route.test.ts` | 슬라이드 API 테스트 |
| `e2e/chat.spec.ts` | 챗 E2E 테스트 |
| `e2e/notebook.spec.ts` | 노트북 E2E 테스트 |

---

## 5. RISK ANALYSIS

### 5.1 기술적 위험

| 위험 | 확률 | 영향 | 완화 전략 |
|------|------|------|----------|
| 기존 기능 손상 | 높음 | 높음 | Characterization 테스트로 동작 보존 검증 |
| 타입 에러 폭증 | 중간 | 중간 | 점진적 타입 개선, 우선순위 지정 |
| 백그라운드 작업 타이밍 변경 | 낮음 | 높음 | 기존 타이밍 테스트로 검증 |

### 5.2 프로세스 위험

| 위험 | 확률 | 영향 | 완화 전략 |
|------|------|------|----------|
| 일정 지연 | 중간 | 중간 | 우선순위 기반 점진적 구현 |
| 테스트 작성 부담 | 높음 | 낮음 | 자동화 도구 활용, 템플릿 사용 |

---

## 6. MITIGATION STRATEGIES

### 6.1 DDD 기반 동작 보존

**ANALYZE 단계:**
1. 기존 API 동작 문서화
2. 입력/출력 패턴 분석
3. 에러 시나리오 파악

**PRESERVE 단계:**
1. Characterization 테스트 작성
2. 각 API 라우트별 스냅샷 생성
3. 동작 검증 자동화

**IMPROVE 단계:**
1. 테스트가 통과하는 상태에서만 리팩토링
2. 작은 단위로 변경
3. 각 변경 후 테스트 실행

### 6.2 점진적 타입 개선

**1단계: 명시적 `any` 제거**
- `nano-banana.ts`의 3개 위치
- 외부 라이브러리 응답 타입 정의

**2단계: API 응답 타입 정의**
- 각 API 라우트의 응답 타입 명시
- Zod 스키마에서 타입 추론

**3단계: 내부 함수 타입 보강**
- 유틸리티 함수 타입 명시
- 제네릭 타입 활용

### 6.3 테스트 커버리지 달성 전략

**우선순위:**
1. **P1: Characterization 테스트** - 기존 동작 보존
2. **P2: 단위 테스트** - 새로운 에러 클래스, 검증 스키마
3. **P3: 통합 테스트** - API 라우트
4. **P4: E2E 테스트** - 주요 사용자 플로우

**자동화:**
- Vitest 커버리지 리포터
- PR 시 커버리지 체크
- 85% 미만 시 머지 차단

---

## 7. DEPENDENCIES

### 7.1 신규 의존성

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0",
    "@playwright/test": "^1.48.0",
    "msw": "^2.0.0"
  }
}
```

### 7.2 기존 의존성 활용

| 의존성 | 용도 |
|--------|------|
| `zod` (4.3.6) | 입력 검증 |
| `@tanstack/react-query` | 테스트에서 서버 상태 모킹 |
| `@supabase/supabase-js` | Supabase 모킹 |

---

## 8. SUCCESS METRICS

### 8.1 정량적 지표

| 지표 | 현재 | 목표 |
|------|------|------|
| 테스트 커버리지 | 0% | 85% |
| `any` 타입 사용 | 3+ | 0 |
| ESLint 에러 | 미정 | 0 |
| LSP 타입 에러 | 미정 | 0 |
| 함수 최대 길이 | 364라인 | < 100라인 |

### 8.2 정성적 지표

- [ ] 모든 API 라우트가 일관된 에러 응답 형식 사용
- [ ] 모든 입력이 Zod로 검증됨
- [ ] 코드가 읽기 쉽고 이해하기 쉬움
- [ ] 새로운 개발자가 온보딩하기 쉬움

---

## 9. ROLLOUT STRATEGY

### 9.1 단계별 배포

**Phase 1: 인프라 구축** (1-2일)
- 테스트 프레임워크 설정
- 에러 클래스 구현
- 설정 파일 구조화

**Phase 2: 핵심 API 개선** (3-5일)
- Chat API 검증 및 에러 처리
- Sources API 검증 및 에러 처리

**Phase 3: 스튜디오 API 개선** (5-7일)
- Slides API 리팩토링
- 기타 스튜디오 API 검증 및 에러 처리

**Phase 4: 테스트 및 검증** (2-3일)
- 커버리지 85% 달성
- E2E 테스트 작성
- 품질 게이트 통과

### 9.2 롤백 계획

- 각 Phase는 독립적인 Git 브랜치에서 작업
- 기능 플래그로 새 에러 처리 활성화/비활성화
- Characterization 테스트로 회귀 감지

---

## NEXT STEPS

1. `/moai run SPEC-REFACTOR-001` 명령으로 DDD 구현 시작
2. ANALYZE: 기존 코드 동작 분석
3. PRESERVE: Characterization 테스트 작성
4. IMPROVE: 리팩토링 수행
5. `/moai sync SPEC-REFACTOR-001` 명령으로 문서화
