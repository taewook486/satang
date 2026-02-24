# API Documentation

Satang 서비스의 API 엔드포인트에 대한 상세 문서입니다.

## 목차

- [에러 처리](#에러-처리)
- [입력 검증](#입력-검증)
- [API 엔드포인트](#api-엔드포인트)
  - [Chat API](#chat-api)
  - [Studio API](#studio-api)
    - [Slides](#slides)
    - [Mindmap](#mindmap)
    - [Infographic](#infographic)
    - [Quiz](#quiz)
    - [Report](#report)

---

## 에러 처리

모든 API 엔드포인트는 표준화된 에러 응답 형식을 반환합니다.

### 에러 응답 형식

```typescript
interface ErrorResponse {
  error: {
    code: string;        // 에러 코드
    message: string;     // 사용자 친화적 메시지
    details?: unknown;   // 추가 디버깅 정보 (개발 환경만)
  }
}
```

### 에러 코드

| 코드 | 상태 코드 | 설명 |
|------|----------|------|
| `VALIDATION_ERROR` | 400 | 요청 데이터 검증 실패 |
| `AUTH_ERROR` | 401 | 인증되지 않은 요청 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `CONFLICT` | 409 | 현재 상태와 충돌 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 한도 초과 |
| `INTERNAL_ERROR` | 500 | 내부 서버 오류 |
| `SERVICE_UNAVAILABLE` | 503 | 서비스 일시적 불가 |

### 사용 예시

```typescript
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  handleApiError
} from '@/lib/errors';

// 에러 발생
throw new ValidationError('필수 필드가 누락되었습니다.', {
  field: 'notebookId'
});

// API 핸들러에서 사용
try {
  // ... 비즈니스 로직
} catch (error) {
  return handleApiError(error);
}
```

---

## 입력 검증

모든 API 요청은 Zod 스키마를 통해 검증됩니다.

### 검증 규칙

- 필수 필드 누락 시 `400 Bad Request` 반환
- 잘못된 데이터 타입 시 `400 Bad Request` 반환
- 범위를 벗어난 값 시 `400 Bad Request` 반환

### 공통 스키마

```typescript
// Notebook ID
notebookIdSchema: string (UUID 형식)

// 언어 코드
languageCodeSchema: 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de'

// 슬라이드 형식
slideFormatSchema: 'minimal' | 'standard' | 'detailed'

// 방향
orientationSchema: 'landscape' | 'portrait'

// 상세 수준
detailLevelSchema: 'minimal' | 'standard' | 'comprehensive'

// 페이지 번호 위치
pageNumberPositionSchema: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
```

---

## API 엔드포인트

### Chat API

AI 채팅 기능을 제공하는 API입니다.

#### POST /api/chat

사용자 메시지를 처리하고 AI 응답을 반환합니다.

**요청 본문:**

```typescript
interface ChatPostRequest {
  notebookId: string;    // 필수: 노트북 UUID
  message: string;       // 필수: 사용자 메시지
}
```

**응답 (스트리밍):**

```typescript
// Server-Sent Events 형식
interface ChatStreamResponse {
  id: string;
  role: 'assistant';
  content: string;       // 스트리밍되는 텍스트 조각
  created_at: string;
}
```

**에러 예시:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "메시지는 필수입니다.",
    "details": {
      "field": "message"
    }
  }
}
```

---

### Studio API

스튜디오 생성 기능을 제공하는 API 그룹입니다.

#### Slides

##### POST /api/studio/slides

노트북 내용을 바탕으로 슬라이드를 생성합니다.

**요청 본문:**

```typescript
interface SlidesPostRequest {
  notebookId: string;           // 필수: 노트북 UUID
  format?: 'minimal' | 'standard' | 'detailed';  // 기본값: 'detailed'
  language?: string;            // 기본값: 'ko'
  prompt?: string;              // 추가 프롬프트
  slideCount?: number;          // 최대 50장
  designThemeId?: string;       // 디자인 테마 ID
  includeCover?: boolean;       // 기본값: true
  includeBridge?: boolean;      // 기본값: true
  includePageNumber?: boolean;  // 기본값: true
  pageNumberPosition?: string;  // 기본값: 'bottom-right'
}
```

**응답:**

```typescript
interface SlidesPostResponse {
  studioOutputId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
```

**검증 규칙:**

- `slideCount`: 1~50 사이의 정수
- `notebookId`: 유효한 UUID 형식

#### Mindmap

##### POST /api/studio/mindmap

노트북 내용을 바탕으로 마인드맵을 생성합니다.

**요청 본문:**

```typescript
interface MindmapPostRequest {
  notebookId: string;      // 필수: 노트북 UUID
  language?: string;       // 기본값: 'ko'
  prompt?: string;         // 추가 프롬프트
}
```

**응답:**

```typescript
interface MindmapPostResponse {
  studioOutputId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
```

#### Infographic

##### POST /api/studio/infographic

노트북 내용을 바탕으로 인포그래픽을 생성합니다.

**요청 본문:**

```typescript
interface InfographicPostRequest {
  notebookId: string;      // 필수: 노트북 UUID
  language?: string;       // 기본값: 'ko'
  orientation?: 'landscape' | 'portrait';  // 기본값: 'landscape'
  detailLevel?: 'minimal' | 'standard' | 'comprehensive';  // 기본값: 'standard'
  prompt?: string;         // 추가 프롬프트
  designThemeId?: string;  // 디자인 테마 ID
}
```

**응답:**

```typescript
interface InfographicPostResponse {
  studioOutputId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
```

#### Quiz

##### POST /api/studio/quiz

노트북 내용을 바탕으로 퀴즈를 생성합니다.

**요청 본문:**

```typescript
interface QuizPostRequest {
  notebookId: string;      // 필수: 노트북 UUID
  language?: string;       // 기본값: 'ko'
  questionCount?: number;  // 최대 50문제
  difficulty?: 'easy' | 'medium' | 'hard';
  prompt?: string;         // 추가 프롬프트
}
```

**응답:**

```typescript
interface QuizPostResponse {
  studioOutputId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
```

#### Report

##### POST /api/studio/report

노트북 내용을 바탕으로 리포트를 생성합니다.

**요청 본문:**

```typescript
interface ReportPostRequest {
  notebookId: string;              // 필수: 노트북 UUID
  language?: string;               // 기본값: 'ko'
  format?: 'markdown' | 'html' | 'pdf';  // 기본값: 'markdown'
  prompt?: string;                 // 추가 프롬프트
}
```

**응답:**

```typescript
interface ReportPostResponse {
  studioOutputId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
```

---

## 진행 상황 추적

모든 스튜디오 API는 Supabase Realtime을 통해 실시간 진행 상황을 브로드캐스트합니다.

### Realtime 구독

```typescript
// Supabase Realtime 구독 예시
const channel = supabase
  .channel(`studio_output:${studioOutputId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'studio_outputs',
    filter: `id=eq.${studioOutputId}`
  }, (payload) => {
    const { status, progress } = payload.new;
    console.log('Status:', status);
    console.log('Progress:', progress);
  })
  .subscribe();
```

### 진행 상황 스키마

```typescript
interface StudioOutputProgress {
  phase: string;         // 현재 단계
  completed: number;     // 완료된 항목 수
  total: number;         // 전체 항목 수
  failed?: number;       // 실패한 항목 수 (선택)
}
```

---

## TypeScript 타입 내보내기

모든 API 타입은 `src/lib/validations`에서 내보내집니다.

```typescript
import {
  ChatPostRequest,
  SlidesPostRequest,
  MindmapPostRequest,
  InfographicPostRequest,
  QuizPostRequest,
  ReportPostRequest,
} from '@/lib/validations';
```

---

## 테스트

각 API 엔드포인트에 대한 테스트는 `__tests__` 디렉토리에 있습니다.

```bash
# Chat API 테스트
src/app/api/chat/__tests__/route.test.ts

# Slides API 테스트
src/app/api/studio/slides/__tests__/route.test.ts

# Infographic API 테스트
src/app/api/studio/infographic/__tests__/route.test.ts

# Mindmap API 테스트
src/app/api/studio/mindmap/__tests__/route.test.ts
```
