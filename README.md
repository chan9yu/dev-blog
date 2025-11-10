# chan9yu's dev blog

> A personal blog built with Next.js 15, TypeScript, and TailwindCSS.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.18.2-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Next.js 15 App Router와 MDX 기반으로 구축된 개인 개발 블로그입니다. GitHub Repository를 컨텐츠 저장소로 사용하여 SSG(Static Site Generation) 방식으로 블로그 포스트를 제공합니다.

<br />

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10.18.2+

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

# 코드 품질 검사
pnpm lint
pnpm type-check

# 프로덕션 빌드
pnpm build
```

### Environment Variables

별도의 환경 변수 설정이 필요 없습니다. 블로그 컨텐츠는 git 서브모듈(`contents/`)로 관리됩니다.

### Available Scripts

```bash
# 개발 서버 (localhost:3036)
pnpm dev

# Storybook (localhost:6006)
pnpm storybook

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
- **Image Optimization**: Sharp 0.34.5
- **Fonts**: Pretendard Variable
- **Animation**: framer-motion 12.23.22

### Analytics & Optimization

- **Analytics**: Vercel Analytics
- **Performance**: Vercel Speed Insights

### Development Tools

- **Package Manager**: pnpm 10.18.2
- **Linting**: ESLint 9 (Flat Config)
- **Formatting**: Prettier 3
- **Git Hooks**: Lefthook
- **Component Dev**: Storybook 9.1.10

<br />

## Project Structure

이 프로젝트는 **Features-First Architecture**를 기반으로 설계되었습니다.
도메인별로 모듈을 독립적으로 구성하여 유지보수성과 확장성을 극대화합니다.

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
│   │   ├── og/                # OG 이미지 생성
│   │   ├── rss/               # RSS 피드
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   ├── sitemap.ts         # 사이트맵
│   │   └── robots.ts          # robots.txt
│   ├── features/              # 도메인별 독립 모듈
│   │   ├── blog/              # 블로그 도메인
│   │   │   ├── components/    #   ├ 블로그 전용 컴포넌트
│   │   │   ├── queries/       #   ├ 데이터 조회 로직
│   │   │   ├── types/         #   ├ 타입 정의
│   │   │   ├── utils/         #   ├ 유틸리티 함수
│   │   │   └── index.ts       #   └ Public API (배럴 파일)
│   │   └── series/            # 시리즈 도메인
│   └── shared/                # 전역 공유 모듈
│       ├── assets/            #   ├ 정적 리소스 (아이콘, 이미지)
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

### Git 서브모듈 기반 컨텐츠 시스템

블로그 컨텐츠는 git 서브모듈로 관리됩니다:

- **Repository**: [chan9yu/blog9yu-content](https://github.com/chan9yu/blog9yu-content)
- **로컬 경로**: `contents/posts/*.mdx`, `contents/about/index.md`
- **이미지 처리**: 빌드 시 `contents/` → `public/posts/` 복사, Next.js Image로 자동 최적화
- **빌드 방식**: SSG (빌드 타임에 로컬 파일 시스템에서 읽기)
- **업데이트**: 컨텐츠 저장소 업데이트 시 서브모듈 자동 갱신 (GitHub Actions)

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
- **Image**: 중앙 정렬 및 최적화된 렌더링
- **Link**: 내부/외부 링크 자동 구분
- **Code**: sugar-high 코드 하이라이팅
- **Table**: 모바일 최적화된 테이블 렌더링

### 컨텐츠 서브모듈 업데이트

로컬에서 컨텐츠 업데이트:

```bash
# 서브모듈을 최신 버전으로 업데이트
git submodule update --remote --merge content

# 변경사항 커밋 및 푸시
git add content
git commit -m "chore: update content submodule"
git push
```

### Vercel Private Submodule 설정

Vercel에서 Private 서브모듈을 사용하는 경우 추가 설정이 필요합니다.

#### 1. GitHub Personal Access Token 생성

1. GitHub → Settings → Developer settings → [Personal access tokens (classic)](https://github.com/settings/tokens)
2. "Generate new token (classic)" 클릭
3. Note: `Vercel Submodule Access`
4. Expiration: `No expiration` (권장) 또는 적절한 기간 선택
5. Select scopes: `repo` (Full control of private repositories) 체크
6. "Generate token" 클릭 후 토큰 복사 (한 번만 표시됨!)

#### 2. Vercel Environment Variables 설정

1. Vercel 프로젝트 → Settings → Environment Variables
2. 새 변수 추가:
   - **Name**: `GITHUB_REPO_CLONE_TOKEN`
   - **Value**: (위에서 생성한 Personal Access Token)
   - **Environments**: Production, Preview, Development 모두 선택
3. "Save" 클릭

#### 3. Vercel Build Settings 설정

1. Vercel 프로젝트 → Settings → General → Build & Development Settings
2. **Install Command** 수정:
   ```bash
   pnpm install:vercel
   ```
3. "Save" 클릭

#### 4. 배포 확인

설정 완료 후 다음 배포부터 자동으로 서브모듈이 정상적으로 클론됩니다.

### 자동 배포 설정

블로그 컨텐츠 업데이트 시 자동으로 서브모듈이 갱신되고 Vercel 배포가 트리거되도록 설정할 수 있습니다.

#### 1. GitHub Secrets 설정

**blog9yu-content 저장소에서:**

1. Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `BLOG_REPO_PAT`
4. Value: [GitHub Personal Access Token](https://github.com/settings/tokens)
   - 필요 권한: `repo` (private repository) 또는 `public_repo` (public만)
   - Workflow 권한 포함 필요

#### 2. GitHub Actions 워크플로우 추가

`blog9yu-content` 저장소에 다음 파일을 추가:

**`.github/workflows/notify-blog.yml`**:

```yaml
name: Notify Blog on Content Update

on:
  push:
    branches:
      - main
    paths:
      - "posts/**"
      - "about/**"

jobs:
  notify-blog:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger blog submodule update
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.BLOG_REPO_PAT }}
          repository: chan9yu/blog9yu.dev
          event-type: content-updated
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

#### 3. 동작 흐름

1. `blog9yu-content` 저장소에 포스트 업데이트 (push to main)
2. GitHub Actions가 `blog9yu.dev`에 repository dispatch 이벤트 전송
3. `blog9yu.dev`의 GitHub Actions가 서브모듈 업데이트 커밋 생성
4. Vercel이 커밋 감지하여 자동으로 빌드 및 배포
5. 새로운 포스트 즉시 반영 완료

<br />

## Key Features

### 📱 모바일 반응형 최적화

완벽한 모바일 UX를 위한 포괄적인 반응형 디자인이 적용되었습니다.

#### 네비게이션

- **햄버거 메뉴**: 모바일 전용 Drawer 컴포넌트
- **터치 최적화**: 모든 버튼 최소 44x44px (WCAG 접근성 준수)
- **반응형 레이아웃**: 데스크톱/태블릿/모바일 각각 최적화된 레이아웃

#### 콘텐츠 표시

- **반응형 타이포그래피**: 디바이스별 최적화된 폰트 크기
- **유연한 그리드**: 화면 크기에 따른 동적 컬럼 조정
- **가독성 향상**: 모바일 환경에 최적화된 줄간격 및 여백

#### 목차 (TOC)

- **데스크톱**: 사이드바 형태의 고정 목차
- **모바일**: Floating 버튼 + Bottom Sheet 형태

### 🎨 애니메이션 시스템

framer-motion 기반의 부드럽고 자연스러운 애니메이션이 적용되었습니다.

#### 핵심 애니메이션

- **페이지 전환**: Fade-in 효과로 자연스러운 페이지 진입
- **스크롤 애니메이션**: 뷰포트 진입 시 점진적 표시
- **레이아웃 전환**: 리스트 ↔ 격자 뷰 전환 시 부드러운 애니메이션
- **Drawer/Modal**: Spring 기반의 자연스러운 슬라이드

#### 성능 최적화

- **GPU 가속**: transform/opacity 속성만 사용
- **FLIP 기법**: framer-motion의 자동 최적화
- **접근성**: `prefers-reduced-motion` 지원

### 📝 포스트 기능

#### 콘텐츠 관리

- **시리즈 지원**: 연관된 포스트를 시리즈로 그룹화
- **태그 시스템**: 다중 태그 지원 및 태그별 필터링
- **검색 최적화**: 전체 텍스트 기반 포스트 검색

#### 사용자 경험

- **목차 (TOC)**: 자동 생성되는 헤딩 기반 목차
- **이전/다음 글**: 포스트 간 빠른 이동
- **공유 기능**: Web Share API + Clipboard fallback
- **댓글**: Utterances 기반 GitHub Issues 연동

#### 뷰 옵션

- **리스트 뷰**: 상세 정보 중심의 세로 레이아웃
- **격자 뷰**: 시각적 썸네일 중심의 그리드 레이아웃
- **읽기 진행도**: 스크롤 기반 읽기 진행 상태 표시

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

- **SSG**: 모든 블로그 페이지 빌드 타임 정적 생성
- **Font Optimization**: Pretendard Variable 폰트 최적화
- **Code Splitting**: 자동 코드 분할
- **Image Optimization**: Next.js Image + Sharp (온디맨드 WebP/AVIF 생성)
- **GitHub Actions**: 컨텐츠 업데이트 시 자동 배포

### 추가 기능

- **Sitemap**: 자동 생성 및 업데이트
- **RSS Feed**: `/rss` 엔드포인트로 제공
- **Robots.txt**: SEO 최적화된 robots.txt
- **Dark Mode**: 시스템 설정 연동 다크 모드 지원
- **Reading Progress**: 포스트 읽기 진행도 표시

<br />

## UI Components

프로젝트에서 사용되는 주요 재사용 컴포넌트들입니다.

### Layout Components

- **SiteNavbar**: 반응형 네비게이션 바
- **MobileMenu**: 햄버거 메뉴 (Drawer 기반)
- **SiteFooter**: 푸터 영역
- **PageTransition**: 페이지 전환 애니메이션 래퍼

### Interactive Components

- **Drawer**: 슬라이드 메뉴 컴포넌트
- **ViewToggle**: 리스트/격자 뷰 전환 토글
- **ShareButton**: Web Share API 기반 공유 버튼
- **ThemeSwitcher**: 다크/라이트 모드 전환
- **ScrollToTop**: 상단으로 스크롤 버튼

### Blog Components

- **BlogPostCard**: 포스트 카드 (리스트/그리드 변형 지원)
- **TableOfContents**: 자동 생성 목차
- **PostNavigation**: 이전/다음 글 네비게이션
- **SeriesNavigation**: 시리즈 내 포스트 네비게이션
- **CommentsSection**: Utterances 댓글 시스템

### Animation Components

- **FadeInWhenVisible**: 스크롤 기반 Fade-in 애니메이션
- **MotionProvider**: 전역 애니메이션 설정 프로바이더

<br />

## License

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
