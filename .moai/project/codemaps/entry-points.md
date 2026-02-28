# 진입점 (Entry Points)

## API 라우트 (17개 엔드포인트)

### 인증 (1개)
- **POST /api/auth/callback**: Supabase OAuth 콜백

### 채팅 (1개)
- **POST /api/chat**: AI 채팅 메시지 전송 (스트리밍)

### 노트북 (1개)
- **POST /api/notebook/suggest-title**: 노트북 제안 제목 생성

### 소스 (2개)
- **POST /api/sources/upload**: 소스 파일 업로드
- **POST /api/sources/process**: 소스 텍스트 추출 처리

### 스튜디오 (12개)
#### 슬라이드 (6개)
- **POST /api/studio/slides**: 슬라이드 생성
- **POST /api/studio/slides/regenerate**: 슬라이드 재생성
- **POST /api/studio/slides/pdf**: PDF에서 슬라이드 생성
- **POST /api/studio/slides/pptx**: PowerPoint에서 슬라이드 생성
- **POST /api/studio/slides/google**: Google Slides 통합
- **POST /api/studio/theme-preview**: 슬라이드 테마 미리보기

#### 기타 콘텐츠 (4개)
- **POST /api/studio/flashcard**: 플래시카드 생성
- **POST /api/studio/infographic**: 인포그래픽 생성
- **POST /api/studio/mindmap**: 마인드맵 생성
- **POST /api/studio/quiz**: 퀴즈 생성

#### 리포트 (2개)
- **POST /api/studio/report**: 리포트 생성
- **POST /api/studio/report/pdf**: PDF 리포트 생성

## 페이지 라우트

### 인증 그룹 (app/(auth)/)
- **/login**: 로그인 페이지
- **/auth/callback**: 인증 콜백

### 메인 그룹 (app/(main)/)
- **/home**: 홈 페이지
- **/notebook/[id]**: 노트북 상세 페이지
- **/settings**: 설정 페이지

### 루트 (app/)
- **/**: 리다이렉트 (홈으로)
- **/layout.tsx**: 루트 레이아웃

## 진입점 패턴

### API 라우트 구조
```
/api/{feature}/{action}
```

### 페이지 라우트 구조
```
{feature}/{detail}
```

### 인증이 필요한 라우트
- 모든 /api/ 엔드포인트 (AuthenticationError)
- /(main) 그룹의 모든 페이지

### 공개 라우트
- /login
- /auth/callback
- /

## 미들웨어 진입점
- **lib/validations/middleware.ts**: 요청 검증
- **lib/errors/index.ts**: 에러 핸들링
- **lib/supabase/middleware.ts**: 인증 체크
