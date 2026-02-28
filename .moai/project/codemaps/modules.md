# 모듈 구조

## lib/

### lib/ai/
- **gemini.ts**: Gemini AI 스트리밍 응답 생성
- AI 채팅 및 콘텐츠 생성의 핵심

### lib/supabase/
- **server.ts**: 서버 사이드 Supabase 클라이언트
- **client.ts**: 클라이언트 사이드 Supabase 클라이언트
- **middleware.ts**: 인증 미들웨어

### lib/validations/
- **middleware.ts**: 요청 검증 미들웨어
- **index.ts**: Zod 스키마 모음

### lib/errors/
- **index.ts**: 커스템 에러 클래스
- **http.ts**: HTTP 에러 처리

### lib/utils/
- **source-text.ts**: 소스 텍스트 빌더

## components/

### components/chat/
채팅 UI 컴포넌트

### components/notebook/
노트북 관리 컴포넌트

### components/sources/
소스 업로드 및 관리

### components/studio/
콘텐츠 생성 스튜디오 UI
- 슬라이드, 인포그래픽, 퀴즈 등

### components/shared/
공통 컴포넌트
- **query-provider.tsx**: TanStack Query 프로바이더

### components/ui/
Radix UI 기반 UI 프리미티브

## hooks/
커스텀 React 훅

## app/

### app/api/
API 라우트 핸들러 (17개 엔드포인트)

### app/(auth)/
인증 관련 페이지
- **/login**: 로그인 페이지
- **/auth/callback**: Supabase 인증 콜백

### app/(main)/
메인 애플리케이션
- **/home**: 홈 페이지
- **/notebook/[id]**: 노트북 상세
- **/settings**: 설정 페이지

## 모듈 책임

| 모듈 | 책임 |
|------|------|
| lib/ai | AI 통합, 스트리밍 응답 |
| lib/supabase | 데이터베이스 클라이언트, 인증 |
| lib/validations | 요청 검증, Zod 스키마 |
| lib/errors | 에러 처리, HTTP 응답 |
| components/ui | 재사용 가능한 UI 프리미티브 |
| app/api | API 엔드포인트 구현 |
