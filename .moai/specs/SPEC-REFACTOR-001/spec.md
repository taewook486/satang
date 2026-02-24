# SPEC: 프로젝트 개선 및 리팩토링 (Project Improvement and Refactoring)

---
id: SPEC-REFACTOR-001
version: 1.0.0
status: planned
created: 2026-02-24
updated: 2026-02-24
author: manager-spec
priority: high
related:
  - research.md
  - plan.md
  - acceptance.md
development_mode: ddd
---

## HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-24 | manager-spec | Initial SPEC creation based on comprehensive research |

---

## 1. UBIQUITOUS REQUIREMENTS (시스템 전반 요구사항)

### 1.1 유비쿼터스 언어 정의

**시스템은 항상** 다음 용어를 일관되게 사용해야 한다:

| 용어 | 정의 |
|------|------|
| Notebook | 사용자가 생성한 지식 노트북의 최상위 컨테이너 |
| Source | 노트북에 추가된 콘텐츠 원본 (PDF, URL, 텍스트 등) |
| Studio Output | AI가 생성한 콘텐츠 (슬라이드, 인포그래픽, 마인드맵, 플래시카드, 퀴즈, 리포트) |
| Chat Message | 사용자와 AI 간의 대화 메시지 |
| Design Theme | 스튜디오 출력물에 적용되는 디자인 테마 |

### 1.2 타입 안전성

**시스템은 항상** TypeScript의 `any` 타입 사용을 피하고 명시적인 타입 정의를 제공해야 한다.

**검증 기준:**
- ESLint 규칙 `@typescript-eslint/no-explicit-any` 위반이 0건이어야 함
- 모든 함수 매개변수와 반환값에 타입 명시가 있어야 함
- API 응답 타입이 명시적으로 정의되어야 함

### 1.3 에러 로깅

**시스템은 항상** 모든 에러를 일관된 형식으로 로깅해야 한다.

**검증 기준:**
- 모든 에러가 구조화된 형식으로 로깅됨
- 에러에 컨텍스트 정보가 포함됨
- 로깅 레벨이 적절하게 사용됨 (error, warn, info)

---

## 2. EVENT-DRIVEN REQUIREMENTS (이벤트 기반 요구사항)

### 2.1 API 요청 검증

**WHEN** API 엔드포인트가 요청을 받으면 **THEN** 시스템은 Zod 스키마를 사용하여 입력값을 검증해야 한다.

**적용 범위:**
- `src/app/api/chat/route.ts`
- `src/app/api/notebook/suggest-title/route.ts`
- `src/app/api/sources/upload/route.ts`
- `src/app/api/sources/process/route.ts`
- `src/app/api/studio/*/route.ts` (모든 스튜디오 라우트)

**요구사항:**
- 각 API 라우트에 Zod 스키마 정의
- 검증 실패 시 400 Bad Request 응답
- 명확한 에러 메시지 반환

### 2.2 에러 응답

**WHEN** 시스템에서 에러가 발생하면 **THEN** 표준화된 에러 응답 형식을 반환해야 한다.

**응답 형식:**
```typescript
interface ErrorResponse {
  error: {
    code: string;        // 에러 코드 (예: VALIDATION_ERROR, AUTH_ERROR)
    message: string;     // 사용자 친화적 메시지
    details?: unknown;   // 추가 디버깅 정보 (개발 환경만)
  }
}
```

### 2.3 백그라운드 작업 진행 상황

**WHEN** 스튜디오 출력 생성이 시작되면 **THEN** 시스템은 Supabase Realtime을 통해 진행 상황을 브로드캐스트해야 한다.

**검증 기준:**
- 진행 상황이 `studio_outputs` 테이블에 실시간 업데이트됨
- 클라이언트가 Realtime 구독을 통해 상태 변경을 수신함
- 폴백으로 3초 간격 폴링이 지원됨

---

## 3. STATE-DRIVEN REQUIREMENTS (상태 기반 요구사항)

### 3.1 입력 검증

**IF** API 요청의 입력값이 Zod 스키마와 일치하지 않으면 **THEN** 시스템은 요청을 거부해야 한다.

**검증 시나리오:**
- 필수 필드 누락
- 잘못된 데이터 타입
- 범위를 벗어난 값
- 잘못된 형식의 문자열

### 3.2 인증 확인

**IF** 사용자가 인증되지 않았으면 **THEN** 시스템은 보호된 리소스에 대한 접근을 거부해야 한다.

**검증 기준:**
- 401 Unauthorized 응답
- 명확한 인증 필요 메시지

### 3.3 동시성 제어

**IF** 슬라이드 이미지 생성이 병렬로 실행되면 **THEN** 시스템은 최대 동시 요청 수를 12로 제한해야 한다.

**현재 문제:**
- `src/app/api/studio/slides/route.ts`에 하드코딩된 `CONCURRENCY_LIMIT = 12`

**개선 방향:**
- 설정 파일로 이동
- 환경 변수로 구성 가능하게 변경

---

## 4. UNWANTED BEHAVIOR REQUIREMENTS (금지 행위 요구사항)

### 4.1 민감 정보 노출 방지

**시스템은 다음을 수행하지 않아야 한다:**
- 에러 메시지에 스택 트레이스를 프로덕션 환경에 노출
- API 키나 시크릿을 로그에 출력
- 사용자 PII를 로그에 포함

### 4.2 타입 안전성 위반 방지

**시스템은 다음을 수행하지 않아야 한다:**
- `any` 타입을 명시적으로 사용 (`// eslint-disable-next-line` 주석으로 우회 금지)
- 타입 단언(`as any`) 사용
- 검증되지 않은 외부 데이터 직접 사용

### 4.3 무제한 리소스 사용 방지

**시스템은 다음을 수행하지 않아야 한다:**
- 슬라이드 생성 시 50개 이상의 슬라이드 허용
- 파일 업로드 시 제한 없는 파일 크기 허용
- 동시 백그라운드 작업 무제한 허용

---

## 5. OPTIONAL REQUIREMENTS (선택적 요구사항)

### 5.1 JSDoc 문서화

**가능하면** 모든 공개 API 함수에 JSDoc 주석을 제공한다.

**우선순위:**
- 높음: API 라우트 핸들러
- 중간: 커스텀 훅
- 낮음: 내부 유틸리티 함수

### 5.2 에러 추적

**가능하면** Sentry 또는 유사한 에러 추적 서비스를 통합한다.

**혜택:**
- 프로덕션 에러 모니터링
- 에러 발생 빈도 추적
- 성능 메트릭 수집

### 5.3 번들 크기 최적화

**가능하면** 번들 크기를 분석하고 최적화한다.

**대상:**
- 동적 임포트 적용
- 사용하지 않는 코드 제거
- 코드 스플리팅 최적화

---

## 6. CONSTRAINTS (제약사항)

### 6.1 기술 제약

| 제약 | 설명 |
|------|------|
| Framework | Next.js 16 App Router 사용 |
| Language | TypeScript 5.9+ |
| Database | Supabase PostgreSQL |
| AI | Google Gemini API |
| Test Framework | Vitest + React Testing Library + Playwright |

### 6.2 호환성 제약

| 제약 | 설명 |
|------|------|
| Node.js | 20.x LTS 이상 |
| 브라우저 | Chrome, Firefox, Safari, Edge 최신 2버전 |
| 모바일 | iOS 14+, Android 10+ |

### 6.3 성능 제약

| 메트릭 | 목표 |
|--------|------|
| API 응답 시간 | P95 < 500ms |
| 챗봇 스트리밍 지연 | < 200ms TTFB |
| 슬라이드 생성 | 50개 슬라이드 < 60초 |
| 번들 크기 | 초기 로드 < 500KB |

---

## 7. ACCEPTANCE CRITERIA SUMMARY

### 필수 완료 기준

- [ ] 모든 API 라우트에 Zod 검증 스키마 추가
- [ ] 커스텀 에러 클래스 구현 및 적용
- [ ] `any` 타입 0건 달성
- [ ] `slides/route.ts` 364라인 함수 분할
- [ ] 테스트 커버리지 85% 달성
- [ ] 매직 넘버 설정 파일로 이동

### 품질 게이트

- TRUST 5 프레임워크 준수
- LSP 에러 0건
- ESLint 에러 0건
- 모든 테스트 통과

---

## 8. DEPENDENCIES

### 내부 의존성

- `src/lib/ai/gemini.ts` - AI 기능
- `src/lib/ai/nano-banana.ts` - 이미지 생성
- `src/lib/supabase/*` - 데이터베이스 클라이언트

### 외부 의존성

- `@supabase/supabase-js` - Supabase 클라이언트
- `@google/genai` - Google AI SDK
- `zod` - 스키마 검증
- `vitest` - 단위 테스트
- `@playwright/test` - E2E 테스트

---

## 9. RISKS AND MITIGATION

| 위험 | 확률 | 영향 | 완화 전책 |
|------|------|------|----------|
| 대규모 리팩토링으로 인한 기능 손상 | 높음 | 높음 | DDD 방식으로 기존 동작 보존 |
| 테스트 작성 시간 초과 | 중간 | 중간 | 우선순위 기반 점진적 테스트 추가 |
| 타입 수정으로 인한 컴파일 에러 | 중간 | 낮음 | 점진적 타입 개선 |

---

## 10. TRACEABILITY

### 요구사항 → 소스 코드 매핑

| 요구사항 ID | 관련 소스 파일 | 비고 |
|------------|---------------|------|
| 1.2 | `src/lib/ai/nano-banana.ts` | `any` 타입 제거 |
| 2.1 | `src/app/api/*/route.ts` | Zod 스키마 추가 |
| 2.2 | 모든 API 라우트 | 에러 처리 표준화 |
| 3.3 | `src/app/api/studio/slides/route.ts` | 동시성 설정 분리 |
| 4.2 | `src/lib/ai/nano-banana.ts` | 타입 안전성 개선 |

---

## NEXT STEPS

1. `/moai run SPEC-REFACTOR-001` 명령으로 DDD 구현 시작
2. ANALYZE 단계에서 기존 코드 동작 분석
3. PRESERVE 단계에서 characterization 테스트 작성
4. IMPROVE 단계에서 리팩토링 수행
