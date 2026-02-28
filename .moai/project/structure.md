# Satang 프로젝트 구조

## 디렉토리 트리

```
src/
├── app/                          # Next.js App Router (페이지 + API 경로)
│   ├── (auth)/                   # 인증 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx          # 로그인 페이지
│   │   └── layout.tsx            # 인증 레이아웃
│   ├── (main)/                   # 메인 앱 라우트 그룹
│   │   ├── home/
│   │   │   └── page.tsx          # 홈 페이지 (노트북 목록)
│   │   ├── notebook/
│   │   │   ├── [id]/             # 동적 라우트
│   │   │   │   ├── page.tsx      # 노트북 상세 페이지
│   │   │   │   └── layout.tsx    # 노트북 레이아웃
│   │   │   └── page.tsx          # 노트북 생성 페이지
│   │   ├── settings/
│   │   │   └── page.tsx          # 설정 페이지
│   │   └── layout.tsx            # 메인 앱 레이아웃
│   ├── api/                      # API 경로 (17개 엔드포인트)
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts      # Google OAuth 콜백
│   │   ├── chat/
│   │   │   └── route.ts          # AI 채팅 (스트리밍)
│   │   ├── notebook/
│   │   │   ├── route.ts          # 노트북 CRUD
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # 노트북 상세/삭제
│   │   │   └── search/
│   │   │       └── route.ts      # 노트북 검색
│   │   ├── sources/
│   │   │   ├── upload/route.ts   # 소스 업로드
│   │   │   └── process/route.ts  # 소스 처리
│   │   └── studio/
│   │       ├── flashcard/route.ts      # 플래시카드 생성
│   │       ├── infographic/route.ts    # 인포그래픽 생성
│   │       ├── mindmap/route.ts        # 마인드맵 생성
│   │       ├── quiz/route.ts           # 퀴즈 생성
│   │       ├── report/route.ts         # 보고서 생성
│   │       └── slides/
│   │           ├── route.ts            # 슬라이드 생성
│   │           ├── google/route.ts     # Google Slides 연동
│   │           ├── pdf/route.ts        # PDF 내보내기
│   │           └── pptx/route.ts       # PPTX 내보내기
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 루트 페이지 (리다이렉트)
│   └── globals.css               # 전역 스타일
│
├── components/                   # React 컴포넌트
│   ├── chat/                     # 채팅 관련 컴포넌트
│   │   ├── chat-panel.tsx        # 채팅 패널
│   │   ├── chat-message.tsx      # 채팅 메시지
│   │   ├── chat-input.tsx        # 채팅 입력
│   │   └── source-citation.tsx   # 소스 인용
│   ├── notebook/                 # 노트북 관련 컴포넌트
│   │   ├── notebook-card.tsx     # 노트북 카드
│   │   ├── notebook-list.tsx     # 노트북 목록
│   │   ├── notebook-create.tsx   # 노트북 생성
│   │   └── notebook-share.tsx    # 노트북 공유
│   ├── sources/                  # 소스 관련 컴포넌트
│   │   ├── source-upload.tsx     # 소스 업로드
│   │   ├── source-list.tsx       # 소스 목록
│   │   ├── source-card.tsx       # 소스 카드
│   │   └── source-process.tsx    # 소스 처리
│   ├── studio/                   # 스튜디오 관련 컴포넌트
│   │   ├── studio-panel.tsx      # 스튜디오 패널
│   │   ├── content-generator.tsx # 콘텐츠 생성기
│   │   ├── output-viewer.tsx     # 출력 뷰어
│   │   ├── theme-selector.tsx    # 테마 선택
│   │   └── outputs/              # 출력 컴포넌트
│   │       ├── flashcard-view.tsx
│   │       ├── infographic-view.tsx
│   │       ├── mindmap-view.tsx
│   │       ├── quiz-view.tsx
│   │       ├── report-view.tsx
│   │       └── slides-view.tsx
│   ├── settings/                 # 설정 관련 컴포넌트
│   │   ├── settings-panel.tsx    # 설정 패널
│   │   ├── profile-settings.tsx  # 프로필 설정
│   │   ├── theme-settings.tsx    # 테마 설정
│   │   └── account-settings.tsx  # 계정 설정
│   ├── shared/                   # 공유 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   ├── tooltip.tsx
│   │   └── loading.tsx
│   └── ui/                       # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       └── ...
│
├── hooks/                        # 커스텀 React Hooks
│   ├── use-supabase.ts           # Supabase 클라이언트
│   ├── use-auth.ts               # 인증 상태 관리
│   ├── use-notebook.ts           # 노트북 관리
│   ├── use-sources.ts            # 소스 관리
│   ├── use-chat.ts               # 채팅 기능
│   ├── use-studio.ts             # 스튜디오 기능
│   └── use-theme.ts              # 테마 관리
│
├── lib/                          # 유틸리티 라이브러리
│   ├── ai/                       # AI 서비스
│   │   ├── gemini-client.ts      # Gemini API 클라이언트
│   │   ├── gemini-flash.ts       # Gemini 3 Flash
│   │   ├── gemini-pro-image.ts   # Gemini 3 Pro 이미지
│   │   └── stream-processor.ts   # 스트리밍 처리
│   ├── errors/                   # 에러 처리
│   │   ├── api-error.ts          # API 에러
│   │   ├── app-error.ts          # 애플리케이션 에러
│   │   └── error-handler.ts      # 에러 핸들러
│   ├── supabase/                 # Supabase 클라이언트
│   │   ├── client.ts             # 클라이언트 (브라우저)
│   │   ├── server.ts             # 서버 (서버 사이드)
│   │   ├── admin.ts              # Admin (서비스 역할)
│   │   └── queries.ts            # 데이터베이스 쿼리
│   ├── utils/                    # 유틸리티 함수
│   │   ├── format.ts             # 포맷팅
│   │   ├── date.ts               # 날짜 처리
│   │   ├── validation.ts         # 검증
│   │   └── cn.ts                 # 클래스명 병합
│   └── validations/              # Zod 스키마
│       ├── notebook.ts           # 노트북 스키마
│       ├── source.ts             # 소스 스키마
│       ├── chat.ts               # 채팅 스키마
│       └── studio.ts             # 스튜디오 스키마
│
└── test/                         # 테스트 설정
    ├── setup.ts                  # 테스트 설정
    ├── mocks/                    # 모킹
    │   ├── supabase.ts           # Supabase 모킹
    │   └── gemini.ts             # Gemini 모킹
    └── utils/                    # 테스트 유틸리티
        ├── test-helpers.ts       # 테스트 헬퍼
        └── factories.ts          # 테스트 데이터 팩토리
```

---

## 디렉토리별 상세 설명

### /app - Next.js App Router

Next.js 13+의 App Router를 사용하여 파일 시스템 기반 라우팅을 구현합니다.

**라우트 그룹:**
- `(auth)/`: 인증 관련 페이지 (로그인)
- `(main)/`: 메인 애플리케이션 (홈, 노트북, 설정)

**API 경로:**
- RESTful API 엔드포인트
- 각 경로는 `route.ts` 파일로 구현
- 서버 컴포넌트에서 직접 호출 가능

**주요 파일:**
- `layout.tsx`: 각 라우트 그룹의 공통 레이아웃
- `page.tsx`: 각 경로의 페이지 컴포넌트
- `globals.css`: Tailwind CSS 전역 스타일

---

### /components - React 컴포넌트

기능별로 조직화된 React 컴포넌트입니다.

**컴포넌트 조직 원칙:**
1. **기능별 분리**: chat, notebook, sources, studio 등 기능 단위로 분리
2. **계층 구조**: UI → Feature → Layout → Page
3. **재사용성**: shared/에 재사용 가능한 컴포넌트 배치
4. **shadcn/ui**: ui/에 shadcn/ui 기본 컴포넌트 배치

**서버/클라이언트 컴포넌트 분리:**
- **서버 컴포넌트**: 기본값, 데이터 페칭, 정적 컴포넌트
- **클라이언트 컴포넌트**: 'use client' 지시어, 인터랙티브 기능

---

### /hooks - 커스텀 React Hooks

상태 관리와 사이드 이펙트를 캡슐화합니다.

**주요 Hooks:**
- `use-supabase.ts`: Supabase 클라이언트 인스턴스 관리
- `use-auth.ts`: 인증 상태 및 사용자 정보
- `use-notebook.ts`: 노트북 CRUD 및 상태 관리
- `use-sources.ts`: 소스 업로드 및 처리
- `use-chat.ts`: 채팅 메시지 및 스트리밍
- `use-studio.ts`: 스튜디오 콘텐츠 생성

**상태 관리 패턴:**
- **Zustand**: 글로벌 상태 (채팅, 노트북 선택)
- **React Query**: 서버 상태 및 캐싱
- **useState**: 로컬 컴포넌트 상태

---

### /lib - 유틸리티 라이브러리

비즈니스 로직과 유틸리티 함수를 포함합니다.

**AI 서비스 (`/lib/ai/`):**
- `gemini-client.ts`: Gemini API 기본 클라이언트
- `gemini-flash.ts`: 텍스트 생성용 Gemini 3 Flash
- `gemini-pro-image.ts`: 이미지 분석용 Gemini 3 Pro
- `stream-processor.ts`: 스트리밍 응답 처리

**에러 처리 (`/lib/errors/`):**
- `api-error.ts`: API 에러 클래스
- `app-error.ts`: 애플리케이션 에러 클래스
- `error-handler.ts`: 통합 에러 핸들러

**Supabase (`/lib/supabase/`):**
- `client.ts`: 브라우저용 Supabase 클라이언트
- `server.ts`: 서버용 Supabase 클라이언트
- `admin.ts`: 관리자용 Supabase 클라이언트 (RLS 우회)
- `queries.ts`: 타입안전한 데이터베이스 쿼리

**유틸리티 (`/lib/utils/`):**
- `format.ts`: 숫자, 날짜, 텍스트 포맷팅
- `date.ts`: 날짜 조작 및 계산
- `validation.ts`: 입력 검증
- `cn.ts`: Tailwind 클래스명 병합 (clsx + twMerge)

**검증 (`/lib/validations/`):**
- `notebook.ts`: 노트북 Zod 스키마
- `source.ts`: 소스 Zod 스키마
- `chat.ts`: 채팅 Zod 스키마
- `studio.ts`: 스튜디오 Zod 스키마

---

### /test - 테스트 설정

Vitest와 Playwright를 위한 테스트 설정입니다.

**테스트 구조:**
- `setup.ts`: 테스트 전역 설정
- `mocks/`: 외부 서비스 모킹
- `utils/`: 테스트 헬퍼 및 팩토리

---

## 모듈 조직화 전략

### 피처 기반 아키텍처 (Feature-Based Architecture)

기능을 중심으로 코드를 조직화합니다.

**장점:**
- 관련 코드를 한 곳에 모음
- 팀 협업에 유리 (기능별 담당)
- 코드 검색 및 이해 용이
- 독립적인 테스트 가능

**구조:**
```
feature/
├── components/      # 피처 전용 컴포넌트
├── hooks/          # 피처 전용 훅
├── lib/            # 피처 전용 로직
├── types.ts        # 피처 타입 정의
└── index.ts        # 공개 API
```

---

### 계층형 아키텍처 (Layered Architecture)

UI → Feature → Layout → Page 계층으로 분리합니다.

**계층 책임:**
1. **UI Layer**: 기본 UI 컴포넌트 (shared/, ui/)
2. **Feature Layer**: 비즈니스 로직 (notebook/, chat/)
3. **Layout Layer**: 페이지 레이아웃 (layout.tsx)
4. **Page Layer**: 페이지 조립 (page.tsx)

---

## 주요 파일 위치

### 설정 파일
- `next.config.ts`: Next.js 설정
- `tailwind.config.ts`: Tailwind CSS 설정
- `tsconfig.json`: TypeScript 설정
- `components.json`: shadcn/ui 설정

### 진입점
- `src/app/layout.tsx`: 루트 레이아웃
- `src/app/page.tsx`: 루트 페이지
- `src/lib/supabase/client.ts`: Supabase 클라이언트 초기화

### 스타일링
- `src/app/globals.css`: 전역 스타일
- `src/components/ui/`: shadcn/ui 컴포넌트 스타일
- `tailwind.config.ts`: Tailwind 설정

---

## 아키텍처 원칙

### 1. 관심사의 분리 (Separation of Concerns)
- UI, 로직, 데이터 계층 분리
- 컴포넌트는 프레젠테이션에 집중
- 비즈니스 로직은 hooks와 lib에 배치

### 2. DRY (Don't Repeat Yourself)
- 재사용 가능한 컴포넌트 추출
- 공통 로직을 hooks로 캡슐화
- 유틸리티 함수 활용

### 3. 단일 책임 원칙 (Single Responsibility Principle)
- 각 컴포넌트/함수는 하나의 책임만 수행
- 파일 크기 제한 (300줄 이하 권장)
- 복잡한 컴포넌트는 하위 컴포넌트로 분리

### 4. 의존성 주입 (Dependency Inversion)
- 구체적인 구현보다 추상화에 의존
- 서비스 계층을 통해 외부 의존성 주입
- 테스트 가능성 향상

---

## 확장을 위한 가이드

### 새로운 피처 추가
1. `/components/feature-name/` 디렉토리 생성
2. `/hooks/use-feature.ts` 훅 생성
3. `/lib/validations/feature.ts` 스키마 생성
4. `/app/api/feature/route.ts` API 경로 추가
5. 필요한 UI 컴포넌트 구현

### 새로운 API 엔드포인트 추가
1. `/app/api/endpoint-name/route.ts` 파일 생성
2. HTTP 메서드별 핸들러 구현 (GET, POST, etc.)
3. Zod 스키마로 입력 검증
4. 에러 처리 및 응답 포맷팅

### 새로운 UI 컴포넌트 추가
1. `/components/`의 적절한 위치에 파일 생성
2. TypeScript 인터페이스로 props 타입 정의
3. 컴포넌트 구현 (서버/클라이언트 결정)
4. 스토리북 또는 테스트로 검증
