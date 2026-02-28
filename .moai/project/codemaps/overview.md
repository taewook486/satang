# Satang 아키텍처 개요

## 시스템 경계

Satang은 AI 기반 지식 관리 플랫폼으로 다음 핵심 기능을 제공합니다:

- **소스 관리**: PDF, 문서 등의 소스 업로드 및 텍스트 추출
- **AI 채팅**: 소스 기반 질문 답변 (Gemini AI)
- **콘텐츠 스튜디오**: 슬라이드, 인포그래픽, 퀴즈, 마인드맵, 플래시카드 생성

## 아키텍처 패턴

### App Router 기반 SSR
- Next.js 16 App Router 아키텍처
- 서버 컴포넌트와 클라이언트 컴포넌트 분리
- 파일 시스템 기반 라우팅

### 데이터베이스
- Supabase (PostgreSQL) as Backend
- 인증: Supabase Auth
- 실시간 구독 미사용 (REST API 기반)

### 상태 관리
- 서버 상태: TanStack Query (React Query)
- 클라이언트 상태: Zustand
- 폼 상태: React Hook Form + Zod 검증

### AI 통합
- Google Gemini API (`@google/genai`)
- 스트리밍 응답 처리
- 컨텍스트 기반 채팅

## 보안 경계

- 인증된 사용자만 API 접근 가능
- Zod 스키마 기반 요청 검증
- Supabase RLS (Row Level Security) 사용 권장

## 핵심 디자인 패턴

### 1. API 라우트 패턴
```
/api/{feature}/{action}
```
예: `/api/studio/slides`, `/api/sources/upload`

### 2. 컴포넌트 조직
```
components/
  ├── {feature}/      # 기능별 컴포넌트
  ├── shared/         # 공통 컴포넌트
  └── ui/             # Radix UI 기반 프리미티브
```

### 3. 에러 처리
- 커스텤 에러 클래스 (`AuthenticationError`, `ValidationError`)
- `handleApiError` 유틸리티로 일관된 에러 응답

## 기술 스택 의존성

- **프레임워크**: Next.js 16, React 19
- **스타일링**: Tailwind CSS 4
- **데이터베이스**: Supabase
- **AI**: Google Gemini
- **상태 관리**: TanStack Query, Zustand
- **폼**: React Hook Form, Zod
- **테스트**: Vitest, Playwright
