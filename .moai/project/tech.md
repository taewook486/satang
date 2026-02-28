# Satang 기술 스택

## 개요

Satang은 현대적인 웹 기술 스택을 기반으로 구축된 AI 기반 콘텐츠 생성 플랫폼입니다. 이 문서에서는 핵심 기술, 개발 환경 설정, 빌드 및 배포 구성, 그리고 주요 의존성을 설명합니다.

---

## 핵심 기술 스택

### 프레임워크 및 언어

**Next.js 16.1.6 (App Router)**
- 선택 이유: React 19.2.4 기반의 최신 App Router 아키텍처
- 주요 기능: 서버 컴포넌트, 스트리밍 SSR, 파일 시스템 라우팅
- 장점: SEO 최적화, 빠른 초기 로딩, 직관적인 페이지 구조

**TypeScript 5.9.3**
- 선택 이유: 컴파일 타임 타입 안전성 및 IDE 지원
- 주요 기능: 엄격한 타입 검사, 인퍼런스, 타입 정의
- 장점: 런타임 에러 감소, 리팩토링 용이성, 자동완성

---

### 데이터베이스 및 인증

**Supabase PostgreSQL**
- 선택 이유: 오픈 소스 Firebase 대안 + 강력한 PostgreSQL
- 주요 기능:
  - Row Level Security (RLS)로 데이터 접근 제어
  - 실시간 구독 (Realtime)
  - 자동 생성된 RESTful API
  - 스토리지 (파일 업로드)
- 장점: 관리형 데이터베이스, 무료 티어, 강력한 쿼리 언어

**Supabase Auth + Google OAuth 2.0**
- 선택 이유: 간편한 소셜 로그인 통합
- 주요 기능:
  - Google OAuth 2.0 소셜 로그인
  - JWT 기반 인증
  - 세션 관리
- 장점: 보안, 사용자 경험, 빠른 구현

---

### 스타일링

**Tailwind CSS v4.1.18**
- 선택 이유: 유틸리티 퍼스트 CSS 프레임워크
- 주요 기능:
  - JIT 컴파일러로 빠른 빌드
  - 다크 모드 지원
  - 반응형 디자인 유틸리티
- 장점: 빠른 개발, 작은 CSS 번들, 일관된 디자인

**shadcn/ui (Radix UI 기반)**
- 선택 이유: 접근 가능한 컴포넌트 라이브러리
- 주요 기능:
  - Radix UI 프리미티브 기반
  - 완전한 커스터마이징 가능
  - TypeScript 네이티브
- 장점: 접근성, 커스터마이징, 코드 소유권

---

### 상태 관리

**Zustand v5.0.11**
- 선택 이유: 가볍고 직관적인 상태 관리
- 주요 기능:
  - 간단한 API
  - DevTools 통합
  - TypeScript 지원
- 장점: Redux보다 간단, Context API보다 강력

**TanStack React Query v5.90.20**
- 선택 이유: 서버 상태 관리 최적화
- 주요 기능:
  - 자동 캐싱 및 재검증
  - 무한 스크롤 지원
  -乐观更新 (Optimistic Updates)
- 장점: 네트워크 요청 간소화, UX 향상

---

### 폼 관리

**React Hook Form v7.71.1**
- 선택 이유: 성능과 개발자 경험
- 주요 기능:
  - 재렌더링 최소화
  - 간단한 API
  - TypeScript 통합
- 장점: 빠른 폼, 적은 코드

**Zod v4.3.6**
- 선택 이유: TypeScript-first 스키마 검증
- 주요 기능:
  - TypeScript 타입 추론
  - 런타임 검증
  - 에러 메시지 커스터마이징
- 장점: 타입 안전성, 단일 소스 진실

---

### AI 서비스

**Google Gemini 3 Flash API**
- 선택 이유: 빠르고 비용 효율적인 텍스트 생성
- 주요 기능:
  - 스트리밍 응답
  - 멀티턴 대화
  - 큰 컨텍스트 윈도우
- 장점: 낮은 지연 시간, 높은 처리량

**Google Gemini 3 Pro Image API**
- 선택 이유: 이미지 분석 및 이해
- 주요 기능:
  - 이미지에서 텍스트 추출
  - 시각적 질문 응답
  - OCR 기능
- 장점: 정확한 분석, 다양한 이미지 형식 지원

---

### 테스트

**Vitest v4.0.18**
- 선택 이유: Vite 기반의 빠른 테스트 러너
- 주요 기능:
  - Jest 호환 API
  - 빠른 테스트 실행
  - TypeScript 기본 지원
- 장점: 빠른 피드백 루프, 간단한 설정

**Playwright v1.58.2**
- 선택 이유: 크로스 브라우저 E2E 테스트
- 주요 기능:
  - Chromium, Firefox, WebKit 지원
  - 자동 대기 메커니즘
  - 네트워크 인터셉션
- 장점: 신뢰할 수 있는 E2E 테스트

---

## 개발 환경 요구사항

### 필수 소프트웨어

**Node.js**
- 버전: v20.x 이상
- 권장: v20 LTS (Long Term Support)
- 패키지 매니저: npm, pnpm, 또는 Bun

**Git**
- 버전: 2.x 이상
-用途: 버전 관리 및 협업

**편집기 (선택 사항)**
- Visual Studio Code (권장)
- WebStorm
- Neovim

### 권장 VS Code 확장

- ESLint: 코드 린팅
- Prettier: 코드 포맷팅
- TypeScript Vue Plugin (Volar): TypeScript 지원
- Tailwind CSS IntelliSense: Tailwind 자동완성
- Error Lens: 인라인 에러 표시

---

## 빌드 및 배포 구성

### 빌드 설정

**Next.js 설정 (`next.config.ts`):**
```typescript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,  // SWC를 사용한 빠른 축소
  images: {
    domains: ['...'],  // 이미지 도메인 허용
  },
  experimental: {
    serverActions: true,  // 서버 액션 활성화
  },
}
```

**TypeScript 설정 (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Tailwind CSS 설정 (`tailwind.config.ts`):**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

---

### 배포 옵션

**Vercel (권장)**
- Next.js 개발사가 제공하는 플랫폼
- 자동 프리뷰 배포
- 무호스티ng SSL
- CDN 전역 배포

**Netlify**
- 대체 배포 플랫폼
- CI/CD 통합
- Edge Functions 지원

**자체 호스팅**
- Docker 컨테이너화
- Kubernetes 오케스트레이션
- PM2 프로세스 관리

---

### 환경 변수

**필수 환경 변수:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 주요 의존성

### 프레임워크 및 라이브러리

```json
{
  "dependencies": {
    // Core
    "next": "^16.1.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",

    // TypeScript
    "typescript": "^5.9.3",
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",

    // Database & Auth
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",

    // Styling
    "tailwindcss": "^4.1.18",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x",

    // State Management
    "zustand": "^5.0.11",
    "@tanstack/react-query": "^5.90.20",

    // Forms
    "react-hook-form": "^7.71.1",
    "zod": "^4.3.6",
    "@hookform/resolvers": "^3.x",

    // AI Services
    "@google/generative-ai": "^0.x",

    // Utilities
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "date-fns": "^3.x",
    "lodash-es": "^4.x"
  }
}
```

### 개발 의존성

```json
{
  "devDependencies": {
    // Testing
    "vitest": "^4.0.18",
    "@playwright/test": "^1.58.2",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",

    // Linting & Formatting
    "eslint": "^8.x",
    "eslint-config-next": "^16.1.6",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.x",

    // Build Tools
    "typescript": "^5.9.3",
    "@types/node": "^20.x",
    "@types/react": "^19.x",

    // Development
    "tsx": "^4.x",
    "nodemon": "^3.x"
  }
}
```

---

## 의존성 카테고리별 정리

### 1. 프레임워크 및 라이브러리
- `next`: Next.js 프레임워크
- `react`, `react-dom`: React 라이브러리
- `typescript`: TypeScript 컴파일러

### 2. 데이터베이스 및 인증
- `@supabase/supabase-js`: Supabase 클라이언트
- `@supabase/auth-helpers-nextjs`: Next.js용 Supabase Auth 헬퍼
- `@supabase/storage-js`: Supabase Storage 클라이언트

### 3. 스타일링
- `tailwindcss`: Tailwind CSS 프레임워크
- `autoprefixer`: CSS 벤더 프리픽스 자동 추가
- `postcss`: CSS 변환 도구
- `tailwind-merge`: Tailwind 클래스 병합
- `clsx`: 조건부 클래스명

### 4. UI 컴포넌트
- `@radix-ui/*`: 접근 가능한 UI 프리미티브
- `lucide-react`: 아이콘 라이브러리
- `class-variance-authority`: CVA (변형 관리)

### 5. 상태 관리
- `zustand`: 경량 상태 관리
- `@tanstack/react-query`: 서버 상태 관리

### 6. 폼 관리
- `react-hook-form`: 폼 상태 관리
- `zod`: 스키마 검증
- `@hookform/resolvers`: React Hook Form 통합

### 7. AI 서비스
- `@google/generative-ai`: Google Gemini API 클라이언트

### 8. 유틸리티
- `date-fns`: 날짜 조작
- `lodash-es`: 유틸리티 함수
- `nanoid`: 고유 ID 생성

### 9. 테스트
- `vitest`: 유닛 테스트 러너
- `@playwright/test`: E2E 테스트 프레임워크
- `@testing-library/react`: React 테스트 유틸리티

### 10. 개발 도구
- `eslint`: 코드 린터
- `prettier`: 코드 포매터
- `tsx`: TypeScript 실행 도구
- `nodemon`: 파일 감시 및 재시작

---

## 성능 최적화 전략

### 1. 코드 스플리팅
- Next.js 자동 코드 스플리팅 활용
- 동적 import()로 라우트 기반 스플리팅
- React.lazy()로 컴포넌트 지연 로딩

### 2. 이미지 최적화
- next/image로 자동 최적화
- WebP/AVIF 형식 사용
- 레이지 로딩 및 플레이스홀더

### 3. 번들 최적화
- SWC 컴파일러로 빠른 빌드
- Tree shaking으로 불필요한 코드 제거
- gzip/brotli 압축

### 4. 캐싱 전략
- React Query로 서버 상태 캐싱
- Next.js CDN으로 정적 자원 캐싱
- Supabase 캐싱 계층 활용

---

## 보안 고려사항

### 1. 인증 및 인가
- Supabase RLS로 데이터 접근 제어
- JWT 기반 인증 토큰
- API 라우트에서 세션 검증

### 2. 환경 변수 관리
- 민감 정보는 .env.local에 저장
- .env.local은 .gitignore에 추가
- 배포 환경에서는 플랫폼 비밀 관리 사용

### 3. CORS 설정
- 허용된 오리진만 허용
- 개발/프로덕션 환경 분리

### 4. 입력 검증
- Zod 스키마로 모든 입력 검증
- SQL 인젝션 방지 (매개변수화된 쿼리)
- XSS 방지 (React 기본 보호)

---

## 모니터링 및 로깅

### 권장 도구

**Vercel Analytics**
- 페이지 뷰 추적
- Web Vitals 모니터링
- 사용자 행동 분석

**Sentry (선택 사항)**
- 에러 추적
- 성능 모니터링
- 릴리스 추적

**Supabase 로그**
- 데이터베이스 쿼리 로그
- API 요청 로그
- 인증 이벤트 로그

---

## 업그레이드 전략

### 의존성 업데이트
- 정기적으로 최신 버전 확인
- 주요 업데이트 전 변경 로그 확인
- 테스트 스위트로 업데이트 검증

### Next.js 업그레이드
- 마이너 버전: 정기 업데이트
- 메이저 버전: 마이그레이션 가이드 참조
- 실험적 기능 주의

---

## 기술 부채 관리

### 현재 알려진 제한사항
1. 오디오 소스 처리: 아직 구현되지 않음
2. Google Docs/Sheets 연동: API 통합 필요
3. 실시간 협업: 웹소켓 구현 필요

### 개선 계획
1. TypeScript 엄격 모드 강화
2. E2E 테스트 커버리지 확대
3. 성능 모니터링 도구 통합
4. 접근성 향상 (WCAG 2.1)

---

## 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Google Gemini API](https://ai.google.dev/docs)
- [Zustand 문서](https://github.com/pmndrs/zustand)
- [TanStack Query 문서](https://tanstack.com/query/latest)
