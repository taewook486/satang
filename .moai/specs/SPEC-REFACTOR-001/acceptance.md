# Acceptance Criteria: 프로젝트 개선 및 리팩토링

---
spec_id: SPEC-REFACTOR-001
version: 1.0.0
development_mode: ddd
traceability_tags: [SPEC-REFACTOR-001]
---

## 1. ACCEPTANCE CRITERIA OVERVIEW

이 문서는 SPEC-REFACTOR-001의 수용 기준을 Given-When-Then (Gherkin) 형식으로 정의한다.

---

## 2. ERROR HANDLING ACCEPTANCE CRITERIA

### 2.1 표준화된 에러 응답

**Scenario: API 에러 발생 시 표준 형식 반환**

```gherkin
GIVEN 사용자가 API 엔드포인트에 요청을 보냄
WHEN 서버에서 에러가 발생함
THEN 응답은 다음 형식을 따라야 함:
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "사용자 친화적 메시지"
    }
  }
AND HTTP 상태 코드가 에러 유형에 맞게 반환됨
AND 개발 환경에서만 details 필드가 포함됨
```

### 2.2 검증 에러

**Scenario: 잘못된 입력값 제출**

```gherkin
GIVEN 사용자가 챗 API에 메시지를 전송함
WHEN message 필드가 비어있거나 4000자를 초과함
THEN 400 Bad Request 상태 코드가 반환됨
THEN 응답 본문에 VALIDATION_ERROR 코드가 포함됨
THEN 응답에 구체적인 검증 에러 메시지가 포함됨
```

**Example Request:**
```json
{
  "notebookId": "invalid-uuid",
  "message": ""
}
```

**Expected Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "fieldErrors": {
        "notebookId": ["Invalid UUID"],
        "message": ["String must contain at least 1 character"]
      }
    }
  }
}
```

### 2.3 인증 에러

**Scenario: 미인증 사용자의 보호된 리소스 접근**

```gherkin
GIVEN 사용자가 로그인하지 않음
WHEN 보호된 API 엔드포인트에 요청함
THEN 401 Unauthorized 상태 코드가 반환됨
THEN 응답 본문에 AUTH_ERROR 코드가 포함됨
THEN 명확한 인증 필요 메시지가 반환됨
```

### 2.4 내부 서버 에러

**Scenario: 예상치 못한 에러 발생**

```gherkin
GIVEN 사용자가 정상적인 요청을 보냄
WHEN 서버 내부에서 예상치 못한 에러가 발생함
THEN 500 Internal Server Error 상태 코드가 반환됨
THEN 응답 본문에 INTERNAL_ERROR 코드가 포함됨
THEN 에러가 로그에 기록됨
THEN 프로덕션에서는 스택 트레이스가 노출되지 않음
```

---

## 3. INPUT VALIDATION ACCEPTANCE CRITERIA

### 3.1 챗 API 검증

**Scenario: 유효한 챗 요청**

```gherkin
GIVEN 사용자가 인증됨
WHEN 다음 형식의 요청을 보냄:
  {
    "notebookId": "valid-uuid",
    "message": "Hello, AI!"
  }
THEN 요청이 검증을 통과함
THEN AI 응답이 스트리밍됨
```

**Scenario: 잘못된 notebookId 형식**

```gherkin
GIVEN 사용자가 인증됨
WHEN 다음 형식의 요청을 보냄:
  {
    "notebookId": "not-a-uuid",
    "message": "Hello"
  }
THEN 400 Bad Request가 반환됨
THEN 검증 에러 메시지에 "Invalid UUID"가 포함됨
```

### 3.2 스튜디오 API 검증

**Scenario: 슬라이드 생성 요청 검증**

```gherkin
GIVEN 사용자가 인증됨
WHEN 다음 형식의 요청을 보냄:
  {
    "notebookId": "valid-uuid",
    "sourceIds": ["uuid-1", "uuid-2"],
    "options": {
      "theme": "professional"
    }
  }
THEN 요청이 검증을 통과함
THEN 백그라운드 작업이 시작됨
THEN 진행 상황이 Realtime으로 브로드캐스트됨
```

**Scenario: sourceIds 배열 비어있음**

```gherkin
GIVEN 사용자가 인증됨
WHEN 다음 형식의 요청을 보냄:
  {
    "notebookId": "valid-uuid",
    "sourceIds": []
  }
THEN 400 Bad Request가 반환됨
THEN 검증 에러 메시지에 "at least 1 source required"가 포함됨
```

**Scenario: sourceIds 최대 개수 초과**

```gherkin
GIVEN 사용자가 인증됨
WHEN 51개의 sourceIds가 포함된 요청을 보냄
THEN 400 Bad Request가 반환됨
THEN 검증 에러 메시지에 "maximum 50 sources"가 포함됨
```

### 3.3 소스 업로드 검증

**Scenario: 파일 크기 제한**

```gherkin
GIVEN 사용자가 인증됨
WHEN 15MB 파일을 업로드함 (제한: 10MB)
THEN 400 Bad Request가 반환됨
THEN 에러 메시지에 "File size exceeds limit"가 포함됨
```

**Scenario: 지원되지 않는 파일 형식**

```gherkin
GIVEN 사용자가 인증됨
WHEN .exe 파일을 업로드함
THEN 400 Bad Request가 반환됨
THEN 에러 메시지에 "Unsupported file type"이 포함됨
```

---

## 4. TYPE SAFETY ACCEPTANCE CRITERIA

### 4.1 Any 타입 제거

**Scenario: TypeScript strict 모드 검사**

```gherkin
GIVEN 프로젝트가 TypeScript strict 모드임
WHEN 전체 코드베이스를 타입 검사함
THEN @typescript-eslint/no-explicit-any 위반이 0건이어야 함
THEN 모든 함수 매개변수에 명시적 타입이 있어야 함
THEN 모든 함수 반환값에 명시적 타입이 있어야 함
```

**Verification Command:**
```bash
npx tsc --noEmit
npx eslint . --rule '@typescript-eslint/no-explicit-any: error'
```

### 4.2 API 응답 타입

**Scenario: API 응답 타입 정의**

```gherkin
GIVEN API 라우트가 응답을 반환함
WHEN 응답이 생성됨
THEN 응답 타입이 명시적으로 정의되어야 함
THEN Zod 스키마에서 타입이 추론되어야 함
```

**Example:**
```typescript
// Definition
const ChatResponseSchema = z.object({
  content: z.string(),
  role: z.enum(['user', 'assistant']),
});

type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Usage
async function sendMessage(input: ChatInput): Promise<ChatResponse> {
  // ...
}
```

---

## 5. CODE REFACTORING ACCEPTANCE CRITERIA

### 5.1 함수 길이 제한

**Scenario: 긴 함수 분할**

```gherkin
GIVEN slides/route.ts에 364라인 함수가 존재함
WHEN 리팩토링이 완료됨
THEN 어떤 함수도 100라인을 초과하지 않아야 함
THEN 각 함수가 단일 책임을 가져야 함
THEN 기존 동작이 보존되어야 함
```

**Verification:**
- ESLint `max-lines-per-function` 규칙 적용
- Characterization 테스트로 동작 보존 검증

### 5.2 매직 넘버 제거

**Scenario: 하드코딩된 값 설정화**

```gherkin
GIVEN 코드에 하드코딩된 숫자가 존재함
WHEN 리팩토링이 완료됨
THEN 모든 설정값이 src/lib/config에 정의되어야 함
THEN 환경 변수로 오버라이드 가능해야 함
THEN 기본값이 문서화되어야 함
```

**Target Values:**
- `CONCURRENCY_LIMIT = 12` → `studioConfig.concurrencyLimit`
- `MAX_SLIDES = 50` → `studioConfig.maxSlides`
- `3000` (refetch interval) → `studioConfig.refetchInterval`

### 5.3 코드 중복 제거

**Scenario: 스튜디오 라우트 공통 로직 추출**

```gherkin
GIVEN 6개의 스튜디오 라우트가 유사한 패턴을 가짐
WHEN 리팩토링이 완료됨
THEN 공통 인증 로직이 미들웨어로 추출됨
THEN 공통 소스 조회 로직이 서비스로 추출됨
THEN 공통 출력 생성 패턴이 유틸리티로 추출됨
```

---

## 6. TESTING ACCEPTANCE CRITERIA

### 6.1 테스트 커버리지

**Scenario: 최소 커버리지 달성**

```gherkin
GIVEN 모든 코드 변경이 완료됨
WHEN 테스트를 실행하고 커버리지를 측정함
THEN 브랜치 커버리지가 85% 이상이어야 함
THEN 함수 커버리지가 85% 이상이어야 함
THEN 라인 커버리지가 85% 이상이어야 함
THEN 구문 커버리지가 85% 이상이어야 함
```

**Verification Command:**
```bash
vitest run --coverage
```

### 6.2 Characterization 테스트

**Scenario: 기존 API 동작 보존**

```gherkin
GIVEN API 라우트에 대한 characterization 테스트가 작성됨
WHEN 리팩토링 후 테스트를 실행함
THEN 모든 characterization 테스트가 통과해야 함
THEN 기존 API 응답 형식이 동일해야 함
THEN 기존 에러 동작이 동일해야 함
```

### 6.3 E2E 테스트

**Scenario: 주요 사용자 플로우**

```gherkin
GIVEN 사용자가 노트북을 생성함
WHEN 챗 메시지를 보내고 AI 응답을 받음
THEN 챗 히스토리에 메시지가 저장됨
THEN UI에 메시지가 표시됨
```

```gherkin
GIVEN 사용자가 소스를 업로드함
WHEN 슬라이드 생성을 요청함
THEN 백그라운드 작업이 시작됨
THEN 진행 상황이 표시됨
THEN 완료 시 슬라이드가 표시됨
```

---

## 7. EDGE CASE SCENARIOS

### 7.1 동시성 에지 케이스

**Scenario: 동시 요청 제한**

```gherkin
GIVEN 슬라이드 생성이 진행 중임
WHEN 20개의 이미지 생성 요청이 동시에 발생함
THEN 최대 12개만 동시에 실행됨
THEN 나머지는 큐에서 대기함
THEN 모든 요청이 순차적으로 완료됨
```

### 7.2 스트리밍 에지 케이스

**Scenario: 스트리밍 중 연결 끊김**

```gherkin
GIVEN 챗 스트리밍이 진행 중임
WHEN 클라이언트 연결이 끊김
THEN 서버가 스트리밍을 안전하게 종료함
THEN 부분 메시지가 저장되지 않음
THEN 에러가 로그에 기록됨
```

### 7.3 Realtime 에지 케이스

**Scenario: Realtime 연결 실패**

```gherkin
GIVEN Realtime 구독이 설정됨
WHEN Realtime 서버에 연결할 수 없음
THEN 폴백 폴링이 3초 간격으로 시작됨
THEN 사용자에게 진행 상황이 계속 표시됨
THEN 재연결 시도가 자동으로 수행됨
```

### 7.4 입력 검증 에지 케이스

**Scenario: 경계값 테스트**

```gherkin
GIVEN 메시지 길이 제한이 4000자임
WHEN 정확히 4000자 메시지를 보냄
THEN 요청이 성공함

WHEN 4001자 메시지를 보냄
THEN 400 에러가 반환됨
```

```gherkin
GIVEN sourceIds 최대 개수가 50개임
WHEN 정확히 50개의 sourceIds를 보냄
THEN 요청이 성공함

WHEN 51개의 sourceIds를 보냄
THEN 400 에러가 반환됨
```

---

## 8. QUALITY GATE CRITERIA

### 8.1 TRUST 5 검증

| 기준 | 검증 방법 | 통과 조건 |
|------|----------|----------|
| Tested | Vitest 커버리지 | ≥ 85% |
| Readable | ESLint 가독성 규칙 | 0 violations |
| Unified | Prettier 포맷팅 | 일관된 스타일 |
| Secured | npm audit | 0 critical/high |
| Trackable | Conventional commits | 모든 커밋 형식 준수 |

### 8.2 빌드 검증

**Scenario: 프로덕션 빌드**

```gherkin
GIVEN 모든 코드 변경이 완료됨
WHEN npm run build를 실행함
THEN 빌드가 에러 없이 완료됨
THEN TypeScript 컴파일 에러가 0건임
THEN ESLint 에러가 0건임
```

**Verification Command:**
```bash
npm run build
npx tsc --noEmit
npx eslint . --max-warnings 0
```

### 8.3 런타임 검증

**Scenario: 개발 서버 실행**

```gherkin
GIVEN 모든 코드 변경이 완료됨
WHEN npm run dev를 실행함
THEN 서버가 에러 없이 시작됨
THEN 모든 API 엔드포인트가 응답함
THEN 콘솔에 에러가 출력되지 않음
```

---

## 9. VERIFICATION CHECKLIST

### 9.1 기능 검증

- [ ] 모든 API 라우트에 Zod 검증 적용됨
- [ ] 모든 API 라우트에 표준화된 에러 처리 적용됨
- [ ] 커스텀 에러 클래스가 모든 에러 시나리오를 커버함
- [ ] 설정 파일에 모든 매직 넘버가 이동됨
- [ ] `any` 타입이 모두 제거됨

### 9.2 품질 검증

- [ ] 테스트 커버리지 85% 달성
- [ ] TypeScript strict 모드 통과
- [ ] ESLint 에러 0건
- [ ] 빌드 성공
- [ ] 모든 테스트 통과

### 9.3 문서 검증

- [ ] JSDoc 주석이 공개 API에 추가됨
- [ ] README가 업데이트됨
- [ ] CHANGELOG 항목이 작성됨

---

## 10. SIGN-OFF CRITERIA

이 SPEC은 다음 조건이 모두 충족될 때 완료로 간주된다:

1. **기능적 요구사항**
   - [ ] 모든 에러 처리가 표준화됨
   - [ ] 모든 입력 검증이 구현됨
   - [ ] 코드 리팩토링이 완료됨

2. **품질 요구사항**
   - [ ] 테스트 커버리지 85% 달성
   - [ ] TRUST 5 품질 게이트 통과
   - [ ] 빌드 및 배포 성공

3. **문서화 요구사항**
   - [ ] 코드 주석 완료
   - [ ] API 문서 업데이트
   - [ ] CHANGELOG 업데이트

---

## DEFINITION OF DONE

이 SPEC은 다음 모든 항목이 완료되었을 때 "Done"으로 간주된다:

- [ ] 모든 Acceptance Criteria 통과
- [ ] 모든 Quality Gate Criteria 통과
- [ ] 모든 Verification Checklist 항목 완료
- [ ] Code Review 완료 및 승인
- [ ] QA 테스트 완료
- [ ] 문서화 완료
- [ ] PR 머지 완료
