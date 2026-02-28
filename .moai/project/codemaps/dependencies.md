# 의존성 분석

## 외부 패키지 의존성

### 핵심 프레임워크
- **next@^16.1.6**: React 프레임워크
- **react@^19.2.4**: UI 라이브러리
- **@tanstack/react-query@^5.90.20**: 서버 상태 관리

### Supabase
- **@supabase/ssr@^0.8.0**: 서버 사이드 Supabase
- **@supabase/supabase-js@^2.95.2**: Supabase 클라이언트

### AI
- **@google/genai@^1.40.0**: Google Gemini API

### UI 라이브러리
- **radix-ui@^1.4.3**: 접근 가능한 UI 컴포넌트
- **tailwindcss@^4.1.18**: 스타일링
- **lucide-react@^0.563.0**: 아이콘
- **sonner@^2.0.7**: 토스트 알림

### 폼 & 검증
- **react-hook-form@^7.71.1**: 폼 상태 관리
- **@hookform/resolvers@^5.2.2**: Zod 통합
- **zod@^4.3.6**: 스키마 검증

### 파일 처리
- **pdf-lib@^1.17.1**: PDF 생성
- **pdf-parse@^2.4.5**: PDF 파싱
- **pptxgenjs@^4.0.1**: PowerPoint 생성
- **puppeteer-core@^24.37.2**: 스크린샷 및 PDF 변환

### 기타 유틸리티
- **date-fns@^4.1.0**: 날짜 처리
- **clsx@^2.1.1**: 클래스 이름 병합
- **zustand@^5.0.11**: 클라이언트 상태 관리

## 내부 모듈 의존성

```mermaid
graph TD
    A[app/api] --> B[lib/supabase]
    A --> C[lib/ai]
    A --> D[lib/validations]
    A --> E[lib/errors]

    C --> F[lib/utils]

    G[components] --> B
    G --> H[lib/utils]
    G --> I[components/ui]

    J[hooks] --> B
    J --> K[@tanstack/react-query]
```

## 의존성 패턴

### 1. API 라우트 의존성
```
api/route.ts → lib/supabase/server
              → lib/ai/gemini
              → lib/validations
              → lib/errors
```

### 2. 컴포넌트 의존성
```
components/feature → lib/supabase/client
                  → lib/utils
                  → components/ui
                  → hooks
```

### 3. 순환 의존성 없음
- lib/는 components/를 import하지 않음
- components/는 app/을 import하지 않음

## 주요 의존성 관계

| 모듈 | 의존성 | 용도 |
|------|---------|------|
| lib/ai | @google/genai | AI 채팅 생성 |
| lib/supabase | @supabase/ssr, @supabase/supabase-js | 데이터베이스, 인증 |
| lib/validations | zod | 요청 검증 |
| components/shared | @tanstack/react-query | 서버 상태 관리 |
| app/api | lib/* | 비즈니스 로직 재사용 |

## 버전 의존성

- Node.js: 권장 18+ (Next.js 16 요구사항)
- React: 19.2.4 (최신)
- Next.js: 16.1.6 (최신 App Router)
