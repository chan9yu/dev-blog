# chan9yu's dev blog

> A modern personal blog built with Next.js 15, TypeScript, and Tailwind CSS.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.24.0-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Next.js 15 App Router와 MDX 기반으로 구축된 개인 개발 블로그입니다.
<br />
Git 서브모듈로 컨텐츠를 관리하며 SSG(Static Site Generation) 방식으로 최적화된 성능을 제공합니다.

<br />

## 📋 기능 명세서

### ✅ 현재 구현된 기능

#### 콘텐츠 관리

- [x] **MDX 블로그 포스트** - 강력한 마크다운 + React 컴포넌트
- [x] **시리즈 기능** - 연관 포스트를 시리즈로 그룹화
- [x] **태그 시스템** - 다중 태그 지원 및 필터링
- [x] **읽기 시간 표시** - 자동 계산된 예상 읽기 시간 (n분)
- [x] **관련 포스트 추천** - 태그 기반 자동 추천
- [x] **포스트 네비게이션** - 이전/다음 글 바로가기

#### 사용자 경험

- [x] **반응형 디자인** - Mobile-First 접근 방식
- [x] **다크모드** - 시스템 설정 연동 + 수동 전환
- [x] **읽기 진행률** - 스크롤 기반 진행 상태 표시
- [x] **목차 (TOC)** - 자동 생성 + 스크롤 연동
- [x] **댓글 시스템** - Giscus (GitHub Discussions) 연동
- [x] **공유 기능** - Web Share API + Clipboard fallback
- [x] **코드 하이라이팅** - Shiki (GitHub 테마)
- [x] **모바일 메뉴** - Drawer 기반 햄버거 메뉴

#### SEO & 분석

- [x] **Vercel Analytics** - 페이지 뷰 및 사용자 분석
- [x] **Speed Insights** - Core Web Vitals 모니터링
- [x] **Open Graph** - 소셜 미디어 최적화
- [x] **Twitter Cards** - 트위터 공유 최적화
- [x] **JSON-LD** - 구조화 데이터 (BlogPosting, WebSite)
- [x] **자동 Sitemap** - 동적 사이트맵 생성
- [x] **RSS Feed** - 구독 지원 (`/rss`)
- [x] **Robots.txt** - SEO 최적화

#### 개발 환경

- [x] **TypeScript** - 타입 안정성
- [x] **ESLint Flat Config** - 최신 ESLint 9 설정
- [x] **React Hooks Rules** - 엄격한 Hooks 검증
- [x] **Prettier** - 자동 코드 포맷팅
- [x] **Git Hooks (Lefthook)** - 커밋 전 자동 검증
- [x] **Features-First Architecture** - 도메인 기반 모듈화

### 🚀 고도화 로드맵

#### Phase 1: 검색 & 분석

- [ ] **검색 기능** ⭐ (최우선)
  - Fuse.js 기반 클라이언트 사이드 전체 검색
  - 제목, 내용, 태그 통합 검색
  - 검색 결과 하이라이팅

- [ ] **조회수 추적**
  - Vercel KV (Redis) 기반 실시간 카운팅
  - 포스트별 조회수 표시
  - API Route Handler: `/api/views/[slug]`

#### Phase 2: UX 개선

- [ ] **이미지 확대 (Lightbox)**
  - 이미지 클릭 시 전체 화면 확대
  - 이미지 갤러리 네비게이션
  - 키보드 단축키 지원 (ESC, 화살표)

- [ ] **인기 포스트 위젯**
  - 조회수 기반 TOP 5 표시
  - 홈페이지 사이드바 배치
  - 주간/월간 트렌딩

- [ ] **북마크 기능**
  - localStorage 기반 읽기 목록
  - 북마크한 포스트 관리 페이지
  - 읽기 진행률 저장

#### Phase 3: 커뮤니티 & 참여

- [ ] 방문자 통계 (전체/오늘)
- [ ] 반응/좋아요 버튼
- [ ] 이메일 구독 (Newsletter)
- [ ] 포스트 평가 (별점)

### 🎯 구현 우선순위

```
1️⃣ 검색 기능 (Fuse.js)          - 가장 중요!
2️⃣ 조회수 (Vercel KV)           - 사용자 참여 지표
3️⃣ 이미지 확대 (Lightbox)        - UX 개선
4️⃣ 인기 포스트                   - 콘텐츠 발견성
5️⃣ 북마크 (localStorage)        - 개인화
```

<br />

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10.24.0+

### Installation

```bash
# 저장소 클론 (서브모듈 포함)
git clone --recurse-submodules https://github.com/chan9yu/blog9yu.dev.git
cd blog9yu.dev

# 이미 클론한 경우 서브모듈 초기화
git submodule update --init --recursive

# 의존성 설치
pnpm install

# 개발 서버 시작 (localhost:3036)
pnpm dev
```

### Environment Variables

로컬 개발을 위해 `.env.local` 파일을 생성하세요

```bash
cp .env.example .env.local
```

필수 환경변수 (Giscus 댓글 시스템)

```env
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=your-category
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

> 설정값 생성: [giscus.app](https://giscus.app) → GitHub Discussions 설정

### Available Scripts

```bash
pnpm dev           # 개발 서버 (localhost:3036)
pnpm build         # 프로덕션 빌드
pnpm start         # 프로덕션 서버 실행
pnpm type-check    # TypeScript 타입 체크
pnpm lint          # ESLint 검사
pnpm lint:fix      # ESLint 자동 수정
pnpm format        # Prettier 자동 포맷팅
pnpm format:check  # Prettier 포맷 체크
```

<br />

## Tech Stack

### Core

- **Framework**: Next.js 15.5.4 (App Router, React Server Components)
- **Runtime**: React 19.1.1
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.13

### Content & Rendering

- **Content**: MDX via next-mdx-remote 5.0.0
- **Code Highlighting**: Shiki 3.19.0 (GitHub themes)
- **Image Optimization**: Sharp 0.34.5
- **Fonts**: Pretendard Variable (next/font)
- **Animation**: framer-motion 12.23.25

### Analytics & SEO

- **Analytics**: Vercel Analytics 1.6.1
- **Performance**: Vercel Speed Insights 1.3.1
- **Comments**: Giscus (@giscus/react 3.1.0)

### Development Tools

- **Package Manager**: pnpm 10.24.0
- **Linting**: ESLint 9.39.1 (Flat Config)
- **Formatting**: Prettier 3.7.4
- **Git Hooks**: Lefthook 2.0.8
- **Type Safety**: typescript-eslint 8.48.1

<br />

## Project Structure

**Features-First Architecture** 기반으로 도메인별 독립 모듈 구성

```
blog9yu.dev/
├── src/
│   ├── app/                    # Next.js App Router (라우팅 전용)
│   │   ├── posts/
│   │   │   ├── [slug]/        # 포스트 상세 페이지
│   │   │   └── page.tsx       # 포스트 목록 페이지
│   │   ├── series/            # 시리즈 페이지
│   │   ├── tags/              # 태그 페이지
│   │   ├── about/             # 소개 페이지
│   │   ├── og/                # OG 이미지 생성 (Dynamic Route)
│   │   ├── rss/               # RSS 피드 (Route Handler)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   ├── sitemap.ts         # 사이트맵 생성
│   │   └── robots.ts          # robots.txt 생성
│   ├── features/              # 도메인별 독립 모듈 (Feature-First)
│   │   ├── blog/              # 블로그 도메인
│   │   │   ├── components/    #   ├ 블로그 전용 컴포넌트
│   │   │   ├── services/      #   ├ 블로그 비즈니스 로직
│   │   │   ├── types/         #   ├ 타입 정의
│   │   │   ├── utils/         #   ├ 유틸리티 함수
│   │   │   └── index.ts       #   └ Public API (배럴 파일)
│   │   ├── series/            # 시리즈 도메인
│   │   └── tags/              # 태그 도메인
│   └── shared/                # 전역 공유 모듈
│       ├── assets/            #   ├ 정적 리소스 (아이콘, 이미지)
│       ├── components/        #   ├ 재사용 가능한 UI 컴포넌트
│       │   └── mdx/           #   │   └ MDX 렌더링 컴포넌트
│       ├── config/            #   ├ 전역 설정 (SEO, 상수)
│       ├── services/          #   ├ 공통 서비스 (Content API)
│       ├── utils/             #   ├ 공통 유틸리티
│       └── styles/            #   └ 글로벌 스타일
├── public/                    # 정적 파일
│   ├── favicons/              # 파비콘
│   ├── fonts/                 # 폰트 파일
│   ├── images/                # 이미지 리소스
│   └── posts/                 # 포스트 이미지 (빌드 시 복사)
└── contents/                  # Git 서브모듈 (컨텐츠 저장소)
    ├── posts/                 # 블로그 포스트 (MDX)
    └── about/                 # About 페이지 (Markdown)
```

### 아키텍처 원칙

#### `src/app/` - 라우팅 레이어

- Next.js App Router의 진입점
- 페이지 라우트와 컴포넌트 연결만 담당
- 비즈니스 로직은 `features/`에 위임

#### `src/features/` - 도메인별 비즈니스 로직

- **독립성**: 도메인 간 의존성 최소화
- **응집성**: 관련 기능을 한 곳에 모아 관리
- **Public API**: `index.ts` 배럴 파일로 외부 노출 제어

#### `src/shared/` - 공통 리소스

- 프로젝트 전반에서 재사용되는 코드
- 특정 도메인에 종속되지 않는 범용 모듈

### Import 경로 규칙

TypeScript 경로 매핑을 통한 깔끔한 import

```typescript
// ✅ Good: 배럴 파일을 통한 간결한 import
import { getAllPosts, formatDate } from "@/features/blog";
import { Button, Modal } from "@/shared/components";

// ❌ Bad: 내부 구조에 직접 접근
import { getAllPosts } from "@/features/blog/services/api";
```

<br />

## Blog Content Management

### Git 서브모듈 기반 컨텐츠 시스템

- **Repository**: [chan9yu/blog9yu-content](https://github.com/chan9yu/blog9yu-content)
- **로컬 경로**: `contents/posts/*.mdx`, `contents/about/index.md`
- **빌드 방식**: SSG (Static Site Generation)
- **이미지 처리**: `contents/` → `public/posts/` 자동 복사, Next.js Image 최적화

### MDX Frontmatter 스키마

```yaml
---
title: string # 필수: 포스트 제목
publishedAt: string # 필수: 발행일 (YYYY-MM-DD)
summary: string # 필수: 요약 (150-160자 권장)
thumbnail?: string # 선택: 썸네일 이미지
tags?: string[] # 선택: 태그 목록
series?: string # 선택: 시리즈명
private?: boolean # 선택: 비공개 포스트
---
```

### 커스텀 MDX 컴포넌트

- **Heading (h1-h6)**: 자동 ID 생성 + 앵커 링크
- **Image**: Next.js Image 최적화 + rounded 스타일
- **Link**: 내부/외부 링크 자동 구분
- **Code**: Shiki 코드 하이라이팅 + 복사 버튼
- **Table**: 모바일 최적화 테이블

### 컨텐츠 업데이트

```bash
# 서브모듈을 최신 버전으로 업데이트
git submodule update --remote --merge contents

# 변경사항 커밋
git add contents
git commit -m "chore: update content submodule"
git push
```

### Vercel 배포 (Private 서브모듈)

Private 서브모듈 사용 시 Vercel 환경변수 설정

1. [GitHub Personal Access Token](https://github.com/settings/tokens) 생성 (repo 권한)
2. Vercel → Settings → Environment Variables
   - `GITHUB_REPO_CLONE_TOKEN` = Personal Access Token
3. Install Command: `pnpm install:vercel`

<br />

## Code Quality

### ESLint 설정 (Flat Config)

- **typescript-eslint**: TypeScript 권장 규칙
- **react-hooks**: React Hooks 엄격 검증
- **simple-import-sort**: import 자동 정렬
- **consistent-type-imports**: 타입 import 강제
- **prettier**: 코드 포맷팅 통합

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

- **pre-commit**: Prettier + ESLint 자동 검사
- **commit-msg**: 커밋 메시지 템플릿 검증

<br />

## SEO & Performance

### 메타데이터 최적화

- ✅ 동적 메타데이터 생성 (Next.js Metadata API)
- ✅ Open Graph + Twitter Card
- ✅ 자동 OG 이미지 생성 (`/og?title=...`)
- ✅ JSON-LD 구조화 데이터 (BlogPosting, WebSite)

### 성능 최적화

- ✅ **SSG**: 모든 페이지 빌드 타임 정적 생성
- ✅ **Font Optimization**: Pretendard Variable (next/font)
- ✅ **Image Optimization**: Sharp + WebP/AVIF 자동 생성
- ✅ **Code Splitting**: 자동 코드 분할
- ✅ **Tree Shaking**: 사용하지 않는 코드 제거

### 추가 기능

- ✅ 자동 Sitemap (`/sitemap.xml`)
- ✅ RSS Feed (`/rss`)
- ✅ Robots.txt (SEO 최적화)
- ✅ Vercel Analytics (페이지 뷰)
- ✅ Speed Insights (Core Web Vitals)

<br />

## License

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
