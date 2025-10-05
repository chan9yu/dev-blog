# chan9yu's dev blog

> A personal blog built with Next.js 15, TypeScript, and TailwindCSS.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Next.js 15 App Router와 MDX 기반으로 구축된 개인 개발 블로그입니다. GitHub Repository를 컨텐츠 저장소로 사용하여 ISR(Incremental Static Regeneration) 방식으로 블로그 포스트를 제공합니다.

<br />

## Quick Start

### Prerequisites

- Node.js 22+
- PNPM 10+

### Installation

```bash
# 저장소 클론
git clone https://github.com/chan9yu/chan9yu-blog.git
cd chan9yu-blog

# 의존성 설치
pnpm install

# 개발 서버 시작 (localhost:3035)
pnpm dev

# 코드 품질 검사
pnpm lint
pnpm type-check

# 프로덕션 빌드
pnpm build
```

### Available Scripts

```bash
# 개발 서버 (localhost:3035)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# TypeScript 타입 체크
pnpm type-check

# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷 체크
pnpm format:check

# Prettier 자동 포맷팅
pnpm format
```

<br />

## Tech Stack

### Core

- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.1.1
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.13

### Content & Rendering

- **Content**: MDX via next-mdx-remote 5.0.0
- **Code Highlighting**: sugar-high 0.9.3
- **Fonts**: Geist Sans & Mono

### Analytics & Optimization

- **Analytics**: Vercel Analytics
- **Performance**: Vercel Speed Insights

### Development Tools

- **Package Manager**: pnpm 10.17.1
- **Linting**: ESLint 9 (Flat Config)
- **Formatting**: Prettier 3
- **Git Hooks**: Lefthook

<br />

## Project Structure

이 프로젝트는 **Features-First Architecture**를 기반으로 설계되었습니다.
도메인별로 모듈을 독립적으로 구성하여 유지보수성과 확장성을 극대화합니다.

```
blog9yu.dev/
├── src/
│   ├── app/                    # Next.js App Router (라우팅 전용)
│   │   ├── blog/
│   │   │   ├── [slug]/        # 블로그 상세 페이지
│   │   │   └── page.tsx       # 블로그 목록 페이지
│   │   ├── og/                # OG 이미지 생성
│   │   ├── rss/               # RSS 피드
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   ├── sitemap.ts         # 사이트맵
│   │   └── robots.ts          # robots.txt
│   ├── features/              # 도메인별 독립 모듈
│   │   └── blog/              # 블로그 도메인
│   │       ├── components/    #   ├ 블로그 전용 컴포넌트
│   │       ├── services/      #   ├ API 및 데이터 처리
│   │       ├── types/         #   ├ 타입 정의
│   │       ├── utils/         #   ├ 유틸리티 함수
│   │       └── index.ts       #   └ Public API (배럴 파일)
│   └── shared/                # 전역 공유 모듈
│       ├── components/        #   ├ 재사용 가능한 UI 컴포넌트
│       │   └── mdx/           #   │   └ MDX 렌더링 컴포넌트
│       ├── services/          #   ├ 공통 서비스 (GitHub API 등)
│       ├── utils/             #   ├ 공통 유틸리티
│       └── styles/            #   └ 글로벌 스타일
└── public/                    # 정적 파일
```

### 폴더별 역할

#### `src/app/` - 라우팅 레이어

- Next.js App Router의 진입점
- 페이지 라우트와 컴포넌트 연결만 담당
- 비즈니스 로직은 `features/`에 위임

#### `src/features/` - 도메인별 비즈니스 로직

각 도메인(feature)의 모든 코드를 캡슐화하여 독립성을 보장합니다.

- **독립성**: 도메인 간 의존성 최소화
- **응집성**: 관련 기능을 한 곳에 모아 관리
- **Public API**: `index.ts` 배럴 파일로 외부 노출 인터페이스 제어

#### `src/shared/` - 공통 리소스

프로젝트 전반에서 재사용되는 코드를 체계적으로 관리합니다.

- **일관성**: 전역적으로 일관된 UI/UX 제공
- **효율성**: 코드 중복 방지 및 개발 생산성 향상
- **확장성**: 새로운 기능 추가 시 기존 자산 활용

### Import 경로 규칙

TypeScript 경로 매핑을 통해 깔끔한 import 구조를 유지합니다:

```typescript
// 절대 경로 사용 (@alias)
import { getBlogPosts, formatDate } from "@/features/blog";
import { CustomMdx } from "@/shared/components/mdx";
import { GitHubClient } from "@/shared/services";

// 배럴 파일을 통한 간결한 import
// ✅ Good: import { getBlogPosts } from "@/features/blog"
// ❌ Bad:  import { getBlogPosts } from "@/features/blog/services/api"
```

<br />

## Blog Content Management

### GitHub Repository 기반 컨텐츠 시스템

블로그 포스트는 별도의 GitHub Repository에서 관리됩니다:

- **Repository**: [chan9yu/blog9yu-content](https://github.com/chan9yu/blog9yu-content)
- **경로**: `posts/*.mdx`
- **업데이트**: ISR을 통해 1시간마다 자동 반영 (revalidate: 3600초)

### MDX Frontmatter 스키마

```yaml
---
title: string # 필수: 포스트 제목
publishedAt: string # 필수: 발행일 (YYYY-MM-DD)
summary: string # 필수: 요약
image?: string # 선택: OG 이미지 경로
---
```

### 커스텀 MDX 컴포넌트

- **Heading (h1-h6)**: 자동 ID 생성 및 앵커 링크
- **Image**: rounded-lg 스타일 적용
- **Link**: 내부/외부 링크 자동 구분
- **Code**: sugar-high 코드 하이라이팅
- **Table**: 커스텀 테이블 렌더링

<br />

## Code Quality

### ESLint 규칙

- `simple-import-sort`: import 문 자동 정렬
- `consistent-type-imports`: 타입 import 시 `type` 키워드 강제
- `no-unused-vars`: 미사용 변수 검사 (`_` prefix 허용)
- `no-explicit-any`: `any` 타입 사용 경고

### Prettier 설정

```yaml
printWidth: 120
tabWidth: 2
useTabs: true
singleQuote: false
semi: true
trailingComma: none
plugins:
  - prettier-plugin-tailwindcss
```

### Git Hooks (Lefthook)

- **pre-commit**: Prettier 포맷팅, ESLint 검사
- **commit-msg**: 커밋 메시지 템플릿 검증

<br />

## SEO & Performance

### 메타데이터

- 동적 메타데이터 생성 (Open Graph, Twitter Card)
- 자동 OG 이미지 생성 (`/og?title=...`)
- JSON-LD 구조화 데이터 (BlogPosting)

### 최적화

- **SSG**: 모든 블로그 페이지 빌드 타임 생성
- **ISR**: 1시간마다 컨텐츠 재검증
- **Font Optimization**: Geist 폰트 최적화 (next/font)
- **Code Splitting**: 자동 코드 분할

### 추가 기능

- 자동 Sitemap 생성
- RSS 피드 제공 (`/rss`)
- Robots.txt 제공

<br />

## License

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
