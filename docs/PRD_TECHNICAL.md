---
title: Engineering PRD — chan9yu 개발 블로그
version: 0.4.0
lastUpdated: 2026-04-12
owner: chan9yu
status: Draft
---

# Engineering PRD — chan9yu 개발 블로그

## 1. Executive Summary

본 문서는 chan9yu 개발 블로그의 **기술 계약(Technical Contract)** 을 정의한다. Next.js 16 App Router 위에 React 19(React Compiler), TypeScript 5.9 strict, Tailwind CSS 4를 조합하고, MDX 기반 콘텐츠를 Git Submodule로 주입하는 **SSG-first** 아키텍처를 채택한다. 도메인은 `features/` 하위 9개 독립 모듈로 분리되며, 각 모듈은 `index.ts`를 통한 Public API로만 외부와 연결된다. 본 PRD는 Product PRD가 정의한 `FEAT-###`·`US-###`·`NFR-###`에 대응하는 `MOD-*`·`RT-*`·`ADR-###` 계약을 원문으로 제공하며, 구현자가 별도 협의 없이 빌드를 시작할 수 있는 수준의 정보를 포함한다.

**Definition of Done**: 본 문서만으로 빈 레포에서 프로덕션 빌드까지의 모든 기술적 질문(스택·라우팅·데이터·배포·품질)에 답할 수 있다.

## 2. Technical Goals & Non-Goals

### 2.1 Goals

- **G-1 SSG-first**: 콘텐츠 페이지는 전부 빌드 타임 정적 생성. 런타임 DB·CMS 의존 없음.
- **G-2 Performance**: `NFR-001 LCP < 2.5s`, `NFR-002 CLS < 0.1`, `NFR-003 INP < 200ms`, `NFR-004 Lighthouse Performance ≥ 95`.
- **G-3 Type-Safe End-to-End**: TypeScript strict + `noUncheckedIndexedAccess` + Zod 런타임 검증.
- **G-4 Single-Author DX**: 로컬에서 MDX 파일만 작성하면 발행 완료. 환경 설정·배포·이미지 처리는 자동화.
- **G-5 Feature Cohesion**: 기능 추가·삭제가 단일 `features/{name}/` 디렉토리 범위에서 완결.
- **G-6 Accessibility Baseline**: 핵심 경로 WCAG 2.1 AA (자세한 내용은 §12).
- **G-7 TDD (Test-Driven Development)**: 기능 구현 전 테스트를 먼저 작성하는 Red→Green→Refactor 사이클을 기본 개발 워크플로우로 채택한다. Testing Trophy 전략으로 Integration 테스트에 가장 높은 비중을 둔다 (`ADR-013`).

### 2.2 Non-Goals

- 런타임 CMS(headless 포함) 연동
- 서버 사이드 풀텍스트 검색(예: Algolia·Meilisearch). 검색은 클라이언트 인덱싱(`ADR-002`)으로 한정.
- 다국어(i18n) 라우팅·번역 워크플로우
- 다중 저자·승인 워크플로우
- 실시간 기능(WebSocket·SSE) 및 서버 액션 기반 mutation (조회수는 예외, `RT-/api/views`)
- 네이티브 앱 빌드·PWA 오프라인 캐싱

**Definition of Done**: 위 Goals가 곧 수용 기준이며, Non-Goals는 향후 설계 회의 시 무조건 참조하여 scope creep을 차단한다.

## 3. System Architecture Overview

### 3.1 계층 다이어그램 (텍스트)

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                         │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│   │ React 19 RSC │  │ Client Island│  │  View        │           │
│   │  (Streamed)  │  │ (Search·View·│  │  Transitions │           │
│   │              │  │ Lightbox·등) │  │  Theme       │           │
│   └──────┬───────┘  └──────┬───────┘  └──────────────┘           │
└──────────┼──────────────────┼────────────────────────────────────┘
           │ HTML+Data        │ fetch `/api/views`
           ▼                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Next.js 16 (App Router)                     │
│   src/app/  (라우팅·metadata·generateStaticParams만)              │
│         │                                                         │
│         ▼ Public API import                                       │
│   src/features/*  ── posts·tags·series·search·views·comments     │
│                    ·theme·lightbox·about                          │
│         │                                                         │
│         ▼                                                         │
│   src/shared/*   ── design tokens·layout·mdx·motion·lucide       │
└──────────┬────────────────────┬──────────────────────────────────┘
           │ build-time read    │ runtime (edge/node)
           ▼                    ▼
  contents/ (submodule)     Vercel KV  Vercel OG  Giscus iframe
  ├─ posts/{slug}/          views:*    Edge f()   GitHub Discussions
  │   ├─ index.mdx
  │   └─ images/
  └─ about/index.md
```

### 3.2 데이터 흐름 (빌드 타임)

1. `contents/posts/**/index.mdx` → `parseFrontmatter()` (`-- → ---` 보정 → gray-matter → `PostFrontmatterSchema`(Zod)) → `PostSummary`/`PostDetail` 파생 타입.
2. `scripts/copy-content-images.mjs` → `contents/posts/{slug}/images/*` → `public/posts/{slug}/images/*` (멱등·prune).
3. `generateStaticParams` → 모든 `RT-*` dynamic path 사전 생성.
4. 각 페이지 Server Component → `next-mdx-remote/rsc` + Shiki 서버 하이라이팅 → HTML + JSON payload.

### 3.3 데이터 흐름 (런타임)

- `RT-/api/views` GET/POST → `@vercel/kv` `incr`/`mget` → `MOD-views`의 `ViewCounter`가 Suspense로 소비.
- `MOD-search`는 첫 상호작용 시 `/api/search-index.json` (빌드 산출물) 또는 서버 초기 페이로드에서 posts summary를 로드해 Fuse 인덱스 구성.
- `MOD-theme`는 `prefers-color-scheme` + localStorage + cookie로 초기 HTML 클래스 결정(서버 쿠키 우선).

**Definition of Done**: 본 §3은 신규 팀원(혹은 미래의 자신)이 5분 안에 시스템 전체 데이터 경로를 이해할 수 있도록 유지한다.

## 4. Tech Stack Matrix

| Layer             | Tool                                               | Role                                                  | Version      | Rationale                                                                       |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| Framework         | Next.js                                            | App Router · RSC · Build                              | ^16.2        | 서버 컴포넌트·Partial Prerendering·내장 Image/Font                              |
| UI Runtime        | React                                              | UI 렌더링                                             | ^19.2        | React Compiler로 수동 memo 제거, use() 훅                                       |
| Language          | TypeScript                                         | 타입 안정성                                           | ^6.0         | strict + noUncheckedIndexedAccess                                               |
| Styling           | Tailwind CSS                                       | 유틸리티 CSS                                          | ^4.2         | CSS Layer·토큰 일원화·JIT                                                       |
| UI Primitives     | shadcn/ui                                          | 접근성 내장 프리미티브 (Dialog·DropdownMenu·Toast 등) | — (CLI copy) | 코드 소유권 모델 — Radix + CVA + Tailwind를 `src/shared/ui/`로 복사 (`ADR-010`) |
| Style DX          | tailwind-variants                                  | 컴포넌트 variant 시스템                               | ^3           | 타입 안전 variant 조합                                                          |
| Style DX          | class-variance-authority (CVA)                     | shadcn variant 엔진                                   | ^0.7         | shadcn CLI 기본, `VariantProps<typeof xxx>` 타입 추출                           |
| Style Util        | clsx + tailwind-merge                              | 조건부 클래스 병합                                    | ^2 / ^3      | `cn()` 유틸                                                                     |
| Theme             | next-themes                                        | class 기반 light/dark + hydration 안전                | ^0.4         | `.dark` 토글·mounted 감지·View Transitions 조합 (`ADR-011`)                     |
| MDX               | next-mdx-remote                                    | RSC 호환 MDX 렌더                                     | ^6           | 빌드 타임 compile + 동적 컴포넌트 주입 (`ADR-006`)                              |
| MDX 파싱          | gray-matter                                        | Frontmatter 분리                                      | ^4           | YAML 기반 메타                                                                  |
| Remark            | remark-gfm · remark-breaks                         | GFM·줄바꿈                                            | ^4           | 테이블·체크박스·한국어 줄바꿈 UX                                                |
| 코드 하이라이트   | shiki                                              | 서버 하이라이트                                       | ^3           | TextMate grammar 정확도 (`ADR-001`)                                             |
| 스키마            | zod                                                | 런타임 검증                                           | ^4           | frontmatter 방어                                                                |
| 검색              | fuse.js                                            | 클라이언트 fuzzy                                      | ^7           | 100~500 포스트 규모 최적 (`ADR-002`)                                            |
| KV                | @vercel/kv                                         | 조회수 저장                                           | ^3           | 플랫폼 통합 (`ADR-003`)                                                         |
| 애니메이션        | framer-motion                                      | 모션 primitives                                       | ^12          | Reduced Motion 지원                                                             |
| 이미지 라이트박스 | yet-another-react-lightbox                         | 모달 뷰어                                             | ^3           | 키보드·터치·접근성                                                              |
| 댓글              | @giscus/react                                      | GitHub Discussions                                    | ^3           | 서버리스, spam 저항                                                             |
| 아이콘            | lucide-react                                       | 아이콘 라이브러리                                     | ^0.5         | tree-shakable, 일관된 스트로크, React 네이티브 컴포넌트                         |
| 이미지 최적화     | sharp                                              | 빌드 타임                                             | ^0.34        | next/image 최적화 엔진                                                          |
| 폰트              | next/font (Pretendard)                             | 가변 폰트                                             | —            | 서브셋 자동                                                                     |
| 분석              | @vercel/analytics · speed-insights                 | 웹 분석                                               | ^1           | CWV 실측                                                                        |
| Lint              | ESLint 9 · eslint-config-next · simple-import-sort | 코드 품질                                             | ^9           | Flat config                                                                     |
| Format            | Prettier 3 · prettier-plugin-tailwindcss           | 포매팅                                                | ^3           | className 자동 정렬                                                             |
| Git Hook          | lefthook                                           | pre-commit 자동화                                     | ^2           | eslint·prettier·tsc                                                             |
| Test Runner       | Vitest                                             | 단위·Integration 테스트                               | ^3           | Vite 기반 HMR, @testing-library 호환 (`ADR-013`)                                |
| Test Library      | @testing-library/react + user-event                | 사용자 관점 DOM 쿼리·인터랙션                         | ^16 / ^14    | `getByRole`·`getByText` 중심, Trophy Integration 레이어 핵심                    |
| Mock              | MSW (Mock Service Worker)                          | 네트워크 모킹                                         | ^2           | `/api/views` 성공/실패/타임아웃 시나리오                                        |
| E2E               | Playwright                                         | 브라우저 스모크 테스트                                | ^1           | Chromium 기본, 모바일 뷰포트 옵션, 핵심 경로 3~5종                              |
| 패키지 매니저     | pnpm                                               | 의존성 관리                                           | ^10          | 디스크·속도 효율                                                                |
| Node              | Node.js                                            | 런타임                                                | ≥22          | ES2023·내장 fetch                                                               |

**Definition of Done**: 각 항목은 (a) Role이 한 줄 요약 가능하고, (b) Rationale이 대체 후보를 배제한 근거를 제공한다.

## 5. Data Model

### 5.1 Frontmatter 스키마 (원문)

```ts
// src/features/posts/schemas/frontmatter.ts
import { z } from "zod";

export const PostFrontmatterSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		slug: z.string().regex(/^[a-z0-9-]+$/),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/),
		private: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		thumbnail: z.string().nullable().default(null),
		series: z.string().nullable().default(null),
		seriesOrder: z.number().int().positive().nullable().default(null)
	})
	.refine((v) => (v.series === null) === (v.seriesOrder === null), {
		message: "series와 seriesOrder는 동시에 설정되거나 동시에 null이어야 합니다"
	});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
```

### 5.2 파생 타입

```ts
export type PostSummary = PostFrontmatter & { readingTimeMinutes: number };

export type PostDetail = PostSummary & {
	contentMdx: string; // MDX 원본 (RSC에서 컴파일)
	toc: TocItem[]; // h1-h3 추출
};

export type TocItem = { id: string; level: 1 | 2 | 3; text: string };

export type Series = {
	name: string;
	slug: string; // slugify(name)
	posts: PostSummary[]; // seriesOrder 오름차순
};

export type TagCount = { tag: string; slug: string; count: number };

export type AdjacentPosts = { prev: PostSummary | null; next: PostSummary | null };

export type RelatedPost = PostSummary & { overlapScore: number };
```

### 5.3 KV 키 스키마

| Key                 | Type     | Purpose       | TTL  |
| ------------------- | -------- | ------------- | ---- |
| `views:post:{slug}` | `number` | 포스트 조회수 | 없음 |

### 5.4 배치 파이프라인 계약

- 목록 페이지에서 다수 슬러그의 조회수를 한 번에 조회할 때는 `@vercel/kv`의 `multi().get(...).exec()` 파이프라인을 사용한다. N+1 금지.

### 5.5 읽기 시간 계산 규칙 (`ADR-008`)

`PostSummary.readingTimeMinutes`는 빌드 타임에 1회 계산되는 정수 필드다.

- **입력 소스**: MDX 본문 원문. 전처리 단계에서 코드 블록(` ` `` fence), 이미지(`<img>`, `![]()`), 수식 블록(`$$...$$`, `\[...\]`)을 제거.
- **문자 수**: 제거 후 남은 문자열의 공백 포함 길이 (`String.prototype.length`).
- **공식**: `readingTimeMinutes = Math.max(1, Math.ceil(chars / 500))`.
- **기준**: 한국어 평균 읽기 속도 500자/분(공백 포함)을 baseline으로 사용. 결과는 항상 1 이상의 정수.

### 5.6 Popular 스냅샷 계약 (`ADR-007`)

홈 사이드바 Popular 블록은 빌드 타임에 생성되는 정적 스냅샷이다.

```ts
export type TrendingSnapshot = {
	popularPosts: PostSummary[]; // top 5, 누적 조회수 desc, 동률 시 최근 발행일 우선
	trendingSeries: Series[]; // top 3, 소속 public 포스트 수 desc, 동률 시 최근 편 발행일 우선
	trendingTags: TagCount[]; // top 10, public 포스트 수 desc
	generatedAt: string; // ISO timestamp
	fallback?: boolean; // KV 실패 시 true (popularPosts는 최근 발행순으로 대체)
};
```

- **생성 시점**: `next build`의 정적 데이터 수집 단계에서 1회.
- **KV 실패 fallback**: `popularPosts`를 최근 발행순으로 대체하고 빌드는 성공. `fallback: true` 플래그 표시.
- **Private 정책**: `private: true` 포스트·그 포스트가 기여하는 태그/시리즈 카운트는 모든 블록 집계에서 완전 제외.

**Definition of Done**: 타입 한 곳 수정이 전체 계층을 무너뜨리지 않는다(`PostSummary`는 `omit` 파생으로 유지). Zod 스키마가 유일한 진입점이며 파생 타입은 `z.infer`로만 생성한다.

## 6. Routing & Rendering Strategy

### 6.1 라우트 테이블

| ID                       | Path                    | Dynamic      | `generateStaticParams` | `generateMetadata` | Suspense            | Runtime              |
| ------------------------ | ----------------------- | ------------ | ---------------------- | ------------------ | ------------------- | -------------------- |
| RT-/                     | `/`                     | —            | —                      | 정적               | —                   | Node                 |
| RT-/posts                | `/posts`                | —            | —                      | 정적               | `FilteredPostsList` | Node                 |
| RT-/posts/[slug]         | `/posts/[slug]`         | slug         | posts 전체 slug        | `ADR-010` 패턴     | `ViewCounter`       | Node                 |
| RT-/tags                 | `/tags`                 | —            | —                      | 정적               | —                   | Node                 |
| RT-/tags/[tag]           | `/tags/[tag]`           | tag          | 모든 unique tag        | 태그명 주입        | —                   | Node                 |
| RT-/series               | `/series`               | —            | —                      | 정적               | —                   | Node                 |
| RT-/series/[slug]        | `/series/[slug]`        | slug         | 모든 series slug       | 시리즈명 주입      | —                   | Node                 |
| RT-/about                | `/about`                | —            | —                      | 정적               | —                   | Node                 |
| RT-/rss                  | `/rss`                  | —            | —                      | —                  | —                   | Node (Route Handler) |
| RT-/sitemap.xml          | `/sitemap.xml`          | —            | `sitemap()`            | —                  | —                   | Node                 |
| RT-/robots.txt           | `/robots.txt`           | —            | `robots()`             | —                  | —                   | Node                 |
| RT-/manifest.webmanifest | `/manifest.webmanifest` | —            | `manifest()`           | —                  | —                   | Node                 |
| RT-/og                   | `/og`                   | searchParams | —                      | —                  | —                   | Edge                 |
| RT-/api/views            | `/api/views`            | —            | —                      | —                  | —                   | Node (Route Handler) |

### 6.2 렌더링 원칙

- **SSG by default**: 모든 페이지 라우트는 빌드 타임 HTML 생성. `dynamic = "force-static"` 명시.
- **Edge for OG**: `/og`는 Edge Runtime에서 `@vercel/og`로 동적 생성.
- **Streaming**: Post 상세는 본문 RSC + `ViewCounter` Suspense boundary. Fallback은 스켈레톤.
- **Metadata**: `generateMetadata`는 공통 헬퍼 `buildMetadata({ title, description, image, path })`로 표준화.

### 6.3 Metadata 헬퍼 시그니처

```ts
// src/shared/seo/build-metadata.ts
export function buildMetadata(input: {
	title: string;
	description: string;
	path: string; // 예: "/posts/slug"
	image?: string; // 절대 URL
	type?: "website" | "article";
	publishedAt?: string;
	noIndex?: boolean; // private 포스트 true
}): Metadata;
```

**Definition of Done**: 모든 `RT-*`가 위 표에 등재되어 있으며, 각 항목의 Suspense·Runtime·Metadata 전략이 하나로 결정되어 있다.

## 7. Feature Modules Specification

각 `MOD-*`는 `features/{name}/` 디렉토리와 1:1 매핑. 외부는 오직 `index.ts`의 Public API만 import 가능. 내부 헬퍼는 `_internal/` prefix로 격리한다.

### 7.1 MOD-posts (FEAT-HOME·FEAT-POSTS-LIST·FEAT-POST-DETAIL·FEAT-READING-AIDS)

```ts
// features/posts/index.ts
export { PostCard, PostList, PostDetail, Toc, RelatedPosts, PostNavigation, ShareButtons } from "./components";
export { useReadingProgress } from "./hooks";
export {
	getAllPosts,
	getPostDetail,
	findAdjacentPosts,
	findRelatedPostsByTags,
	getTrendingPosts,
	calculateReadingTime
} from "./services";
export type { PostSummary, PostDetail, TocItem, AdjacentPosts, RelatedPost, TrendingSnapshot } from "./types";
```

- `getAllPosts(options?: { includePrivate?: boolean }): Promise<PostSummary[]>` — date desc 정렬.
- `getPostDetail(slug: string): Promise<PostDetail | null>` — 없으면 null (→ 404).
- `findAdjacentPosts(posts: PostSummary[], slug: string): AdjacentPosts`
- `findRelatedPostsByTags(posts: PostSummary[], target: PostSummary, limit = 3): RelatedPost[]`
- `getTrendingPosts(limit = 5): Promise<PostSummary[]>` — 빌드 타임 KV 스냅샷, 누적 조회수 내림차순. 동률 시 최근 발행일 우선. KV 실패 시 최근 발행순 fallback (`ADR-007`).
- `calculateReadingTime(content: string): number` — 한국어 500자/분, 코드·이미지·수식 제외, 최소 1분 floor (`ADR-008`).

### 7.2 MOD-tags (FEAT-TAGS-HUB·FEAT-TAG-DETAIL)

```ts
export { TagList, TagHub, TagChip } from "./components";
export { getAllTags, getPostsByTag, getTagCounts, getTrendingTags } from "./services";
export type { TagCount } from "./types";
```

- `getTrendingTags(limit = 10): Promise<TagCount[]>` — 빌드 타임 스냅샷. public 포스트 수 내림차순 상위 N. `private: true` 포스트 기여분은 집계에서 제외 (`ADR-007`).

### 7.3 MOD-series (FEAT-SERIES-HUB·FEAT-SERIES-DETAIL)

```ts
export { SeriesCard, SeriesNavigation, SeriesPosts, PopularSeries } from "./components";
export { getAllSeries, getSeriesDetail, getSeriesStats, getTrendingSeries } from "./services";
export type { Series } from "./types";
```

- `getTrendingSeries(limit = 3): Promise<Series[]>` — 빌드 타임 스냅샷. 소속 public 포스트 수 내림차순. 동률 시 최근 편 발행일 우선. `private: true` 포스트는 집계에서 제외 (`ADR-007`).

### 7.4 MOD-search (FEAT-SEARCH)

```ts
export { SearchButton, SearchModal, SearchResultItem } from "./components";
export { useSearch, useSearchShortcut } from "./hooks";
export type { SearchResult } from "./types";
```

- `useSearch({ posts, threshold = 0.4, limit = 10 })`: Fuse.js 인덱스는 `useMemo` + React Compiler 의존성으로 자동 최적화.
- **인덱스 가중치**: `title: 0.5`, `description: 0.3`, `tags: 0.2`.
- **청킹 임계**: 인덱스 직렬화 크기 > 300KB gzipped면 tag-grouped 청킹 전략 전환 (`ADR-011 TBD`).
- 단축키: ⌘K (macOS) · Ctrl+K (others). `useSearchShortcut({ onTrigger })`.

### 7.5 MOD-views (FEAT-VIEW-COUNTER)

```ts
export { ViewCounter } from "./components";
export { useViews } from "./hooks";
export { getPostViews, incrementPostViews, getBatchPostViews } from "./services/kv-client";
```

- KV 실패 시 `ViewCounter`는 조용히 0 또는 "—"로 fallback. 에러는 console.warn에만 보고.
- `POST /api/views { slug }` → 204. `GET /api/views?slug=xxx` → `{ views: number }`.

### 7.6 MOD-comments (FEAT-COMMENTS)

```ts
export { CommentsSection } from "./components";
```

- `CommentsSection`는 `<GiscusComments />`를 `IntersectionObserver` 기반 lazy 마운트.
- 환경변수 4종(`NEXT_PUBLIC_GISCUS_REPO`, `REPO_ID`, `CATEGORY`, `CATEGORY_ID`)은 빌드 타임에 주입.

### 7.7 MOD-theme (FEAT-THEME)

```ts
export { ThemeProvider, ThemeSwitcher } from "./components";
export { useTheme } from "./hooks"; // next-themes 래퍼
export type { Theme } from "./types"; // "light" | "dark"
```

- **기반 라이브러리**: `next-themes` (`ADR-011`). `<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme="system">`로 `app/providers.tsx`에서 루트 래핑.
- 초기화 전략: cookie → localStorage → `prefers-color-scheme` 순 (next-themes가 관리).
- `color-scheme` CSS 속성은 inline style이 아니라 `.dark` 셀렉터 기반으로 `tokens.css`에서 직접 선언 (hydration 안전).
- 전환 애니메이션: `document.startViewTransition(...)` 가 있을 때만 사용 (progressive enhancement).
- mounted 상태 감지: `useSyncExternalStore`로 감싸 서버·클라이언트 초기 렌더 불일치 방지.
- 세부 컨벤션: `.claude/rules/theme.md` 원문 참조.

### 7.8 MOD-lightbox (FEAT-LIGHTBOX)

```ts
export { ImageLightbox, LightboxProvider } from "./components";
export { useLightbox, useLightboxContext } from "./hooks";
```

- `MOD-lightbox`는 `shared/components/mdx/MdxImage`와 연동. 페이지 단위 `LightboxProvider`가 루트에 위치.

### 7.9 MOD-about (FEAT-ABOUT)

```ts
export { AboutProfile } from "./components";
export { getAboutContent } from "./services";
```

- `contents/about/index.md`를 `MdxRemote`로 렌더.

**Definition of Done**: 각 MOD-\*는 Public API 한 곳만 import 가능하며, 다른 MOD를 직접 참조하지 않는다(교차 의존은 `shared/`로 끌어올림).

## 8. Shared Layer Specification

### 8.1 디자인 토큰 (CSS-only SSOT)

```
shared/styles/
├─ tokens.css           # Primitive + Semantic CSS 변수 (light + .dark 오버라이드)
├─ base.css             # Reset + root rules + prefers-reduced-motion
├─ animations.css       # keyframes + View Transitions
├─ prose.css            # MDX 본문 (.prose 스코프)
├─ scrollbar.css
├─ shiki.css            # 코드 하이라이트 light/dark
└─ globals.css          # Tailwind 4 @theme inline 매핑 + Typography scale + shadcn alias
```

- **CSS-only SSOT**: 색·Typography·Radius·Shadow 모든 토큰을 `tokens.css` + `globals.css @theme inline`에만 정의. 별도 TS 팔레트 파일을 두지 않음 (Tailwind 4 CSS-first 철학 준수).
- **테마 토글**: `html.dark` 클래스가 Semantic 변수 그룹을 덮어쓴다. `color-scheme`은 `.dark` 셀렉터 기반 직접 선언 (ADR-011).
- **shadcn alias**: `@theme inline`에 `--color-background`·`--color-foreground`·`--color-border`·`--color-ring` 등 shadcn 표준 키를 우리 Semantic 토큰에 매핑하여 shadcn 컴포넌트 코드 수정 없이 자동 사용.
- **arbitrary value 금지**: `max-w-[72rem]`·`border-(--color-border-subtle)` 등 임의값 사용 금지. 표준 클래스(`max-w-6xl`) 또는 토큰 자동 생성 클래스(`max-w-content`, `border-border-subtle`) 우선. 세부: `.claude/rules/styling.md`.

### 8.2 공통 컴포넌트 (평탄 구조)

```
shared/components/
├─ Header.tsx · Footer.tsx · Container.tsx · Sidebar.tsx
├─ MobileMenu.tsx · NavLink.tsx · SocialLinks.tsx · ScrollToTopButton.tsx
├─ ShareButton.tsx · ReadingProgress.tsx · ScrollReset.tsx
├─ FadeInWhenVisible.tsx · MotionProvider.tsx · PageTransition.tsx
└─ mdx/
   ├─ CustomMDX.tsx · MdxHeading.tsx · MdxImage.tsx · MdxLink.tsx
   ├─ MdxCode.tsx · MdxPre.tsx · MdxTable.tsx · ShikiCodeBlock.tsx
   └─ Callout.tsx
```

### 8.3 MDX 컴포넌트 API (대표)

```ts
type MdxHeadingProps = { level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode };
// 자동 id = slugify(textContent), 앵커 링크(#) 노출

type MdxImageProps = { src: string; alt: string; caption?: string };
// 클릭 시 MOD-lightbox로 확대

type ShikiCodeBlockProps = { code: string; lang?: string; filename?: string };
// 우상단 "복사" 버튼(2초 "Copied!"), light/dark 테마 자동 전환
```

### 8.4 Icon Set — Lucide Icons

- **라이브러리**: `lucide-react` — 일관된 스트로크 스타일의 오픈소스 아이콘 라이브러리. tree-shakable하여 사용한 아이콘만 번들에 포함된다.
- **Import 패턴**: `import { Search, Moon, Sun, ChevronLeft } from "lucide-react"` — 개별 named import.
- **크기 통일**: `size` prop 또는 Tailwind `className="size-5"` (모바일) / `"size-6"` (데스크톱).
- **사용 아이콘 (주요)**: Archive, ArrowLeft, ArrowUp, BookOpen, Calendar, Check, ChevronLeft, ChevronRight, Clock, Copy, Mail, Eye, Github, Grid3x3, Linkedin, List, Menu, Moon, Search, Share2, Sun, Tag, X 등.

### 8.5 shadcn/ui 컴포넌트 (`shared/ui/`)

shadcn/ui는 라이브러리가 아니라 **코드 소유권 모델**이다. `pnpm dlx shadcn@latest add <component>`로 프리미티브(Dialog·DropdownMenu·Toast·Tooltip 등)를 `src/shared/ui/`로 복사 후 프로젝트 코드로 직접 관리한다.

- **위치**: `src/shared/ui/` (CLI가 kebab-case로 생성 → PascalCase로 리네이밍, 예: `Dialog.tsx`·`Badge.tsx`).
- **Variant 시스템**: `class-variance-authority` (CVA). `cva()` 반환값은 컴포넌트 파일 내부에서만 사용(외부 export 금지), props에 `VariantProps<typeof xxxVariants>` 교차 적용.
- **Import 규칙**: 배럴 파일(`index.ts`) **금지**. `import { Badge } from "@/shared/ui/Badge"` 직접 경로 import.
- **Props**: 별도 `type`으로 선언(인라인 금지). 외부에서 props 추론이 필요하면 `ComponentProps<typeof Badge>` 사용.
- **Compound 컴포넌트**: `Object.assign(CardRoot, { Header: CardHeader, ... })` 패턴. 서브컴포넌트 함수명에 부모 prefix(예: `CardHeader`) 필수.
- 세부: `.claude/rules/shadcn.md` 원문.

### 8.6 `shared/modules/` 규약

자체 완결 미니 라이브러리는 `shared/modules/<module>/`에 배치한다. 다음 중 하나라도 해당하면 모듈로 승격:

- 상태를 가짐 (Context, 클래스 인스턴스)
- 여러 파일로 분해됨
- 공개 API와 내부 구현을 분리하고 싶음
- 프레임워크 독립(React 없이 동작)으로 설계됨

**필수 구성**

```
shared/modules/<module>/
├─ README.md            # What / Public API / Usage / Configuration / Port(선택) / Non-goals
├─ index.ts             # Leaf barrel — 외부 노출의 유일 진입점
├─ types.ts
├─ <Module>Port.ts      # 교체 가능한 인터페이스 계약 (선택)
├─ <Module>.ts          # 구현
└─ __tests__/
```

**Import 규칙**: `@/shared/modules/<module>`(leaf barrel)만 허용. `@/shared/modules` 같은 중간 배럴은 금지.

**Definition of Done**: 어떤 기능도 shared에서 feature를 import하지 않는다(단방향 의존 — `.claude/rules/project-structure.md`의 **Law 2**). MDX·shadcn·Icon 컴포넌트 props 시그니처는 TypeScript 시그니처 + JSDoc으로 문서화된다. `shared/modules/*`는 각각 README + leaf barrel + tests를 포함한다.

## 9. Content Pipeline

### 9.1 Submodule 레이아웃

```
contents/
├─ posts/
│  ├─ {slug}/
│  │   ├─ index.mdx
│  │   └─ images/*.{png,jpg,webp,avif}
│  └─ @template/           # 제외 대상 (prefix `@` 는 무시)
└─ about/
    └─ index.md
```

### 9.2 파싱 흐름

```
raw file
  ↓ read
  ↓ normalize: `-- → ---` 보정, 최종 개행 정규화
  ↓ gray-matter.split: { data, content }
  ↓ PostFrontmatterSchema.parse(data) → fail이면 빌드 중단 + slug 포함 에러
  ↓ slugify(name) 일관성 검사: frontmatter.slug === dir.basename
  ↓ reading-time.calculate(content)
  ↓ toc.extract(content)
  ↓ PostDetail 조립
```

### 9.3 이미지 복사 스크립트

```
scripts/copy-content-images.mjs
- 입력: contents/posts/*/images/**
- 출력: public/posts/{slug}/images/**
- 동작: fs.stat mtime 비교 후 변경된 파일만 복사(멱등). 삭제된 원본 → prune.
- 트리거: `pnpm dev` 사전 실행, `pnpm build` 사전 실행.
```

### 9.4 Submodule 배포 workaround

```
scripts/vercel-submodule-workaround.sh
- 실행: Vercel Build Command의 최초 단계
- 동작:
  1. `.gitmodules`의 SSH URL (git@github.com:owner/repo.git)을
     HTTPS + ${GITHUB_REPO_CLONE_TOKEN}@github.com/owner/repo.git 로 치환
  2. `git submodule sync && git submodule update --init --recursive`
  3. 실패 시 exit 1
- 권한: 토큰은 read-only, repo scope만.
```

**Definition of Done**: `pnpm build`만 실행하면 로컬·Vercel 모두에서 `contents/` 최신본이 반영된 정적 사이트가 생성된다.

## 10. SEO & Metadata Infrastructure

### 10.1 표준 Metadata

- 모든 페이지: `title`, `description`, `canonical`, `og:*`, `twitter:card = summary_large_image`, `locale = ko_KR`.
- 포스트 상세: `type: "article"`, `publishedTime`, `authors`, `tags`.

### 10.2 JSON-LD

- `WebSite` (루트 `layout.tsx`에 1회).
- `BlogPosting` (포스트 상세에 1회) — headline, datePublished, author, keywords, image, url.
- `BreadcrumbList` (포스트/태그/시리즈 상세) — 계층 1→2→3.

### 10.3 `/og` Edge Handler

```ts
// src/app/og/route.tsx (runtime: "edge")
// Query: title (required) · tag? · thumbnail?
// 동작: thumbnail이 있으면 그대로 프록시, 없으면 ImageResponse로 렌더
//  - 배경: 다크 그라디언트
//  - Foreground: title 48px, tag 20px, 사이트 로고
// 크기: 1200x630
```

### 10.4 Sitemap 규칙

| 경로             | priority | changefreq |
| ---------------- | -------- | ---------- |
| `/`              | 1.0      | daily      |
| `/posts`         | 0.9      | daily      |
| `/posts/[slug]`  | 0.8      | weekly     |
| `/series`        | 0.7      | weekly     |
| `/series/[slug]` | 0.6      | weekly     |
| `/tags`          | 0.6      | weekly     |
| `/tags/[tag]`    | 0.5      | weekly     |
| `/about`         | 0.5      | monthly    |

- `private: true` 포스트는 sitemap에서 제외.

### 10.5 RSS

- `/rss` (Route Handler) → RSS 2.0 XML.
- 항목: title·link·guid·description·pubDate·author·category(tags).
- private 포스트 제외.

### 10.6 robots.txt

- `/*` allow, `private` slug 차단 규칙은 불필요(sitemap·검색 모두에서 제외되므로 URL을 노출하지 않는다). 오히려 검색엔진의 우연한 발견 방지 차원에서 `Disallow: /posts/{privateSlug}` 동적 추가 검토.

**Definition of Done**: `Rich Results Test`·`Facebook Sharing Debugger`에서 각 페이지가 오류 없이 렌더되고, `/sitemap.xml`·`/rss`가 유효한 XML이다.

## 11. Performance & Observability

### 11.1 비기능 요구사항

| ID      | 지표                   | 목표            | 측정                    |
| ------- | ---------------------- | --------------- | ----------------------- |
| NFR-001 | LCP (p75 mobile)       | < 2.5s          | Speed Insights          |
| NFR-002 | CLS                    | < 0.1           | Speed Insights          |
| NFR-003 | INP                    | < 200ms         | Speed Insights          |
| NFR-004 | Lighthouse Performance | ≥ 95            | CI lighthouse-ci (옵션) |
| NFR-005 | JS Transfer (홈)       | < 120KB gzipped | `next build` 분석       |
| NFR-006 | Font FOUT 기간         | < 100ms         | next/font subset        |

### 11.2 최적화 레시피

- `sharp`로 `next/image` 최적화. `<MdxImage>`는 `width/height` 명시로 CLS 방지.
- `next/font`로 Pretendard Variable 서브셋 주입 (korean + latin).
- Shiki는 서버 렌더 → 클라이언트 JS 비용 0.
- `framer-motion`·`yet-another-react-lightbox`는 `next/dynamic`으로 지연 로드.
- `prefers-reduced-motion: reduce` → 모션 비활성.

### 11.3 관측

- `@vercel/analytics`·`@vercel/speed-insights`는 layout 루트에서 `<Analytics />`·`<SpeedInsights />`로 주입.
- 배포 후 24h 내 Core Web Vitals 통과 여부를 릴리즈 체크리스트에 포함.

**Definition of Done**: 프로덕션 배포 후 Speed Insights에서 위 5개 지표가 모두 green이다.

## 12. Accessibility Requirements

### 12.1 대상 경로

- RT-/, RT-/posts, RT-/posts/[slug], RT-/tags, RT-/series, RT-/about, RT-/api/views가 사용되는 UI, Search Modal, Drawer.

### 12.2 키보드 맵

| 키              | 동작                          |
| --------------- | ----------------------------- |
| ⌘K / Ctrl+K     | Search Modal 열기             |
| Esc             | Modal·Drawer·Lightbox 닫기    |
| ← / →           | Lightbox 이전/다음 이미지     |
| Tab / Shift+Tab | 포커스 이동 (Modal 내부 트랩) |

### 12.3 구현 요구

- Skip link: `<a href="#main">본문 바로가기</a>`.
- 모든 버튼·아이콘 링크에 `aria-label`.
- 모달·드로어는 `role="dialog"` + `aria-modal="true"` + 포커스 트랩.
- 포커스 링: `focus-visible` 전역 스타일로 2px outline.
- 명암 대비: 본문 텍스트 4.5:1, 대제목 3:1 이상. 코드 하이라이트는 7:1(AAA) 목표.
- `prefers-reduced-motion` 존중.

**Definition of Done**: axe-core 자동 감사 0 critical + 키보드만으로 모든 핵심 경로 탐색 가능.

## 13. Security & Privacy

### 13.1 비밀 관리

- `.env*`는 VCS에 커밋하지 않는다 (`.env.example`만 템플릿).
- 토큰 스코프 최소화:
  - `GITHUB_REPO_CLONE_TOKEN`: fine-grained PAT, `contents:read` 단독.
  - `KV_REST_API_TOKEN` vs `KV_REST_API_READ_ONLY_TOKEN` 분리 — 쓰기 토큰은 `/api/views`에만 노출.

### 13.2 iframe·3rd-party

- Giscus: `origin` 고정, `<script src>` SRI 고려.
- Vercel OG: Edge Runtime 전용, 사용자 입력 sanitize (title 길이 제한 120자).

### 13.3 Private 포스트 정책

- 본문 파일은 존재하나 모든 노출 표면에서 제외:
  - `getAllPosts({ includePrivate: false })` 기본값
  - sitemap·RSS·검색 인덱스·관련 포스트·인접 포스트·태그/시리즈 집계 전부 제외
  - 직접 URL 접근 시 200 허용하되 `robots: noindex, nofollow` 메타 및 JSON-LD 생략
  - Private slug는 공식 목록에 결코 들어가지 않는다.

### 13.4 콘텐츠 무결성

- MDX 본문의 raw HTML 허용 여부는 `rehype-raw` 미사용으로 금지(기본). 이미지·링크는 커스텀 컴포넌트만 경유.

**Definition of Done**: 어떤 private 포스트의 URL도 sitemap/rss/search/related에 등장하지 않음을 단위 테스트로 증명한다.

## 14. DevTools & Quality Gates

### 14.1 Lint / Format

- ESLint 9 flat config: `next/core-web-vitals` + `next/typescript` + `simple-import-sort` + `prettier`.
- Prettier 3 + `prettier-plugin-tailwindcss` (className 정렬).
- 파일 타입별 glob은 lefthook이 관리.

### 14.2 lefthook

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      {
        files: "git diff --cached --name-only --diff-filter=d",
        glob: "*.{js,ts,jsx,tsx,mjs}",
        run: "pnpm exec eslint {files} --fix",
        stage_fixed: true
      }
    prettier:
      {
        files: "git diff --cached --name-only --diff-filter=d",
        glob: "*.{js,ts,jsx,tsx,mjs,json,yaml,yml,md,css}",
        run: "pnpm exec prettier --write {files}",
        stage_fixed: true
      }
    type-check: { glob: "*.{ts,tsx}", run: "pnpm exec tsc --noEmit" }
prepare-commit-msg:
  commands:
    template: { run: "node scripts/commit-msg.mjs {1}" }
```

### 14.3 Testing — TDD + Testing Trophy

#### 개발 워크플로우: Red → Green → Refactor

모든 기능·유틸·서비스 구현은 다음 사이클을 따른다.

1. **Red**: 의도한 동작을 검증하는 테스트를 먼저 작성한다. 테스트가 **올바른 이유로 실패**함을 확인한다.
2. **Green**: 테스트를 통과하는 **최소한의 코드**만 작성한다.
3. **Refactor**: 테스트가 녹색인 상태에서 코드를 정리한다. 테스트를 수정하지 않고 구현만 개선한다.

UI 컴포넌트(M1 Skeleton)는 더미 데이터 기반이라 TDD를 엄격히 적용하기 어렵다. M1에서는 "렌더 확인" 수준의 스모크 테스트만 허용하고, M2 이후 실데이터 교체 시점부터 본격 TDD를 적용한다.

#### Testing Trophy 전략 (`ADR-013`)

```
         ╱  E2E  ╲              ← 가장 적게 (비용 높고 느림)
        ╱──────────╲
       ╱ Integration ╲          ← 가장 많이 (신뢰도 최고)
      ╱────────────────╲
     ╱      Unit        ╲      ← 순수 함수·유틸만
    ╱────────────────────╲
   ╱    Static Analysis    ╲    ← TypeScript strict + ESLint (이미 적용)
  ╱────────────────────────────╲
```

| 레이어          | 도구                                  | 대상                                                                                                                                                                                | 비중                      |
| --------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **Static**      | TypeScript strict + ESLint 9          | 전 코드                                                                                                                                                                             | ~10% (항시, 빌드·CI 차단) |
| **Unit**        | Vitest                                | 순수 함수: `parseFrontmatter`, `calculateReadingTime`, `slugify`, `findAdjacentPosts`, `findRelatedPostsByTags`, `extractTocFromMarkdown`                                           | ~20%                      |
| **Integration** | Vitest + @testing-library/react + MSW | 컴포넌트 + 서비스 조합: "getAllPosts → PostList 렌더 → 카드 6장 노출", "SearchModal 오픈 → 타이핑 → 결과 반환", "ViewCounter KV 실패 → fallback '—' 표시", Private 포스트 제외 로직 | **~60%**                  |
| **E2E**         | Playwright                            | 스모크 3~5종: 홈 → 포스트 진입 / ⌘K 검색 → 결과 클릭 / 포스트 상세 TOC 클릭 스크롤                                                                                                  | ~10%                      |

#### Integration 테스트 원칙

- **사용자 관점으로 테스트**: DOM 구조가 아닌 "사용자가 보는 것"을 `getByRole`·`getByText`로 검증.
- **MSW로 네트워크 격리**: `/api/views` 같은 런타임 API는 MSW 핸들러로 모킹. KV 실패 시나리오도 MSW로 재현.
- **Private 포스트 정책**: `getAllPosts({ includePrivate: false })`가 private 포스트를 반환하지 않음을 Integration 레벨에서 증명.
- **한 테스트 = 한 사용자 시나리오**: Given/When/Then을 US의 AC와 1:1 매핑.

### 14.4 CI (GitHub Actions)

```yaml
# .github/workflows/ci.yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - checkout (submodules: recursive, token: ${{ secrets.REPO_CLONE_TOKEN }})
      - setup pnpm + node 22 (cache)
      - pnpm install --frozen-lockfile
      - parallel: [ pnpm lint, pnpm exec tsc --noEmit, pnpm format:check ]
      - pnpm build
```

### 14.5 워크플로우 규약

커밋·PR 생성은 사용자의 **명시적 요청**이 있을 때만 수행한다. 자의적 `git commit` / `git push` / `gh pr create`는 금지. 근본 원인 분석 없이 `setTimeout`·임시 플래그 변수로 이슈를 우회하지 않는다. 원문: `.claude/rules/workflow.md`.

**Definition of Done**: PR 생성 시 CI가 녹색, pre-commit이 자동 교정을 수행한다. 언어·UI·테마·접근성 세부는 `.claude/rules/{react,components,shadcn,theme,typescript,styling,a11y,workflow,project-structure}.md`가 원문이며 본 PRD는 참조만 제공한다.

## 15. Deployment

### 15.1 플랫폼

- Vercel (Production + Preview). 도메인: `www.chan9yu.dev` (apex `chan9yu.dev` → www 리다이렉트).
- Trailing slash: 비활성(`trailingSlash: false`).

### 15.2 Build Command

```
bash scripts/vercel-submodule-workaround.sh \
  && node scripts/copy-content-images.mjs \
  && pnpm next build
```

### 15.3 환경변수 매트릭스

| Key                              | dev                     | preview | prod                      | 설명                        |
| -------------------------------- | ----------------------- | ------- | ------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | `http://localhost:3100` | 자동    | `https://www.chan9yu.dev` | 절대 URL 기준               |
| `NEXT_PUBLIC_GISCUS_REPO`        | ✓                       | ✓       | ✓                         | 댓글 레포                   |
| `NEXT_PUBLIC_GISCUS_REPO_ID`     | ✓                       | ✓       | ✓                         |                             |
| `NEXT_PUBLIC_GISCUS_CATEGORY`    | ✓                       | ✓       | ✓                         |                             |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | ✓                       | ✓       | ✓                         |                             |
| `GITHUB_REPO_CLONE_TOKEN`        | —                       | ✓       | ✓                         | submodule clone (read-only) |
| `KV_URL`                         | opt                     | ✓       | ✓                         |                             |
| `KV_REST_API_URL`                | opt                     | ✓       | ✓                         |                             |
| `KV_REST_API_TOKEN`              | opt                     | ✓       | ✓                         | 쓰기 전용 (/api/views)      |
| `KV_REST_API_READ_ONLY_TOKEN`    | opt                     | ✓       | ✓                         | 읽기 전용                   |
| `REDIS_URL`                      | opt                     | ✓       | ✓                         |                             |

### 15.4 복구 런북 (Submodule 실패)

1. `GITHUB_REPO_CLONE_TOKEN` 만료 여부 확인 → GitHub Settings에서 PAT 재발급.
2. Vercel 대시보드 Environment Variables에 새 토큰 저장 + Redeploy.
3. 로컬에서 `git submodule sync && git submodule update --remote --recursive`로 재현 테스트.

### 15.5 캐시 헤더

- 정적 자산(`/_next/static/*`): `public, max-age=31536000, immutable`.
- HTML: Next.js 기본 `s-maxage=...` 준수.
- `/api/views`: `Cache-Control: no-store`.

**Definition of Done**: PR 생성 시 Preview URL이 자동 발급되고, main 머지 시 Production이 무중단 롤아웃된다.

## 16. Project Structure Convention

```
dev-blog/
├─ docs/
│  ├─ PRD_PRODUCT.md
│  └─ PRD_TECHNICAL.md
├─ public/
│  ├─ favicons/  fonts/  images/
│  └─ posts/{slug}/images/   (빌드 산출물·gitignore)
├─ scripts/
│  ├─ commit-msg.mjs · commit-template.txt
│  ├─ copy-content-images.mjs
│  └─ vercel-submodule-workaround.sh
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx · page.tsx · not-found.tsx · loading.tsx
│  │  ├─ manifest.ts · robots.ts · sitemap.ts
│  │  ├─ rss/route.ts · og/route.tsx
│  │  ├─ posts/ · tags/ · series/ · about/
│  │  └─ api/views/route.ts
│  ├─ features/
│  │  ├─ posts/ · tags/ · series/ · search/ · views/
│  │  ├─ comments/ · theme/ · lightbox/ · about/
│  │  └─ (each) components/ · services/ · hooks/ · types/ · utils/ · schemas/ · _internal/ · index.ts
│  └─ shared/
│     ├─ components/ (평탄 — Header/Footer/Container/Sidebar/MobileMenu/NavLink 등)
│     ├─ ui/ (shadcn primitives — Sheet 등, Compound 패턴)
│     ├─ styles/ (tokens.css + base/animations/prose/scrollbar/shiki + globals.css)
│     ├─ seo/ · config/ · utils/ · hooks/
│     └─ types/
├─ contents/                  # submodule
├─ next.config.ts · tsconfig.json · eslint.config.mjs · postcss.config.mjs
├─ package.json · pnpm-lock.yaml · pnpm-workspace.yaml
└─ README.md · LICENSE · lefthook.yaml
```

### 16.1 The 3 Laws (단방향 의존)

본 아키텍처의 본질은 **삭제 가능성(deletability)** 이다. `rm -rf src/features/posts/`를 해도 나머지 앱이 컴파일되는가? 이 질문이 건강도의 리트머스다.

| 법칙  | 정의                                             | 위반 시 증상                                   |
| ----- | ------------------------------------------------ | ---------------------------------------------- |
| Law 1 | 의존성은 단방향: `app → features → shared`       | 순환 의존, 빌드 타임 증가, 연쇄 파괴           |
| Law 2 | `shared/`는 `features/`를 import 하지 않는다     | 도메인 누수 (예: `shared/utils/formatPost.ts`) |
| Law 3 | `features/a`는 `features/b`를 import 하지 않는다 | feature 격리 실패, 삭제 불가                   |

원문: `.claude/rules/project-structure.md` §1.

### 16.2 명명 규칙

| 대상                   | 규칙                                       | 예시                                       |
| ---------------------- | ------------------------------------------ | ------------------------------------------ |
| 컴포넌트 파일          | PascalCase                                 | `PostCard.tsx`, `ThemeSwitcher.tsx`        |
| hook/util 파일         | camelCase                                  | `useDebounce.ts`, `slugify.ts`             |
| 디렉토리               | kebab-case 또는 camelCase                  | `posts/`, `components/`                    |
| 배럴 파일              | `index.ts`만                               | —                                          |
| 인터페이스             | `I` prefix 금지, `Port` suffix 권장        | `StorageAdapterPort` · `ViewsClient`       |
| 금지 패턴              | underscore prefix 디렉토리                 | `_components/` · `private/` 금지           |
| 내부 전용 서브디렉토리 | `_internal/`                               | `features/posts/_internal/`                |
| Composition 컴포넌트   | `XxxWithYyy.tsx` 또는 `XxxComposition.tsx` | `app/posts/[slug]/PostDetailWithViews.tsx` |

### 16.3 Feature 간 협업 패턴

Feature 간 cross-import가 금지되므로 (Law 3), 협업이 필요하면 아래 패턴 중 하나를 사용.

1. **Composition via Slot** (가장 빈도 높음): feature가 `children`/slot prop 노출, `app/` 레이어에서 조립.
2. **Ref Broker**: `app/`이 `useRef`를 보유하고 두 feature에 주입 (실시간 통신).
3. **공통 타입은 shared로 승격**: 두 feature가 같은 엔티티 타입을 쓰면 `shared/types/`로. 단 도메인 누수 주의 — 대안은 feature별 자체 타입 중복 허용.
4. **이벤트 버스** (매우 제한적): `shared/modules/event-bus/` 같은 중립 인프라. 남용 주의.

세부: `.claude/rules/project-structure.md` §5.

### 16.4 Import 규칙

- alias: `@/app/*`, `@/features/*`, `@/shared/*`.
- 상대 경로는 **동일 모듈 내부만** 허용.
- feature → feature 직접 import 금지 (Law 3).
- shared → feature 직접 import 금지 (Law 2).
- Public API는 `features/{name}/index.ts`만 노출 (feature 배럴은 이곳에만 존재).
- shared의 중간 배럴 금지 — `@/shared/modules/toast`(leaf)는 허용, `@/shared/modules`는 금지.
- `shared/ui/*`는 배럴 없이 직접 경로 import: `@/shared/ui/Badge`.
- Import 순서: external → internal (`@/*`) → relative (`./`, `../`). 세부는 `.claude/rules/typescript.md`.

### 16.5 데이터 접근 (SSG-first)

본 프로젝트는 SSG-first이므로 **TanStack Query·SWR 같은 클라이언트 캐시 레이어를 도입하지 않는다** (`ADR-012`). 런타임 서버 상태는 사실상 `/api/views` 하나뿐이다. `services/`의 순수 함수를 RSC에서 직접 호출하고, 클라이언트 상호작용은 `hooks/`에서 `useState` + `useEffect` 또는 `useSyncExternalStore`로 감싸는 수준으로 충분.

**Definition of Done**: `eslint-plugin-boundaries` 또는 `no-restricted-imports` 커스텀 규칙으로 Law 1/2/3 위반을 CI에서 차단할 수 있다(권장). 3 Laws와 협업 패턴은 `.claude/rules/project-structure.md`가 원문이며, 본 §16은 요약과 PRD 연결만 제공한다.

## 17. Testing Strategy — TDD + Testing Trophy

§14.3에서 정의한 Testing Trophy 전략의 **실행 규약**을 명세한다.

### 17.1 TDD 사이클 규약

| 단계         | 행동                                     | 검증                                     |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| **Red**      | 의도한 동작을 검증하는 테스트 작성       | 테스트가 **올바른 이유로 실패**함을 확인 |
| **Green**    | 테스트를 통과하는 **최소한의 코드** 작성 | `pnpm test` 녹색                         |
| **Refactor** | 테스트 녹색 유지하며 코드 정리           | 테스트 수정 없이 구현만 개선             |

**적용 범위**

- M2~M7: 모든 서비스·유틸·훅·API 라우트에 적용. 기능 코드 전에 테스트가 먼저 존재해야 한다.
- M1(UI Skeleton): 더미 데이터 기반 렌더 확인 수준의 스모크 테스트만 허용. M2에서 실데이터 교체 시 본격 TDD 적용.

### 17.2 Testing Trophy 비중

```
         ╱  E2E  ╲              ~10% (비용 높고 느림, 핵심 경로만)
        ╱──────────╲
       ╱ Integration ╲          ~60% (신뢰도 최고, 가장 많이)
      ╱────────────────╲
     ╱      Unit        ╲      ~20% (순수 함수·유틸만)
    ╱────────────────────╲
   ╱    Static Analysis    ╲    ~10% (TS strict + ESLint, 항시)
  ╱────────────────────────────╲
```

### 17.3 레이어별 상세

#### Static Analysis (항시)

- TypeScript strict + `noUncheckedIndexedAccess` → 타입 레벨 버그 차단
- ESLint 9 + `eslint-plugin-boundaries` → 아키텍처 위반 차단
- **CI에서 빌드 차단**: `pnpm exec tsc --noEmit` + `pnpm lint`

#### Unit (Vitest)

- **대상**: `features/*/services/`, `features/*/utils/`, `shared/utils/` 내 순수 함수
- **핵심 유틸**: `parseFrontmatter`, `calculateReadingTime`, `slugify`, `extractTocFromMarkdown`, `findAdjacentPosts`, `findRelatedPostsByTags`, `sortPostsByDateDescending`
- **원칙**: 입출력만 검증. 모킹 최소화(순수 함수이므로 모킹 불필요).

#### Integration (Vitest + @testing-library/react + MSW)

- **대상**: 컴포넌트 + 서비스 조합, 사용자 시나리오 검증
- **테스트 파일 위치**: 각 feature의 `__tests__/` 또는 컴포넌트 옆 `*.test.tsx`
- **핵심 시나리오 (US AC 1:1 매핑)**:
  - `getAllPosts()` → `PostList` 렌더 → 카드 6장 노출 (US-001)
  - `getPostDetail(slug)` → `PostDetail` 렌더 → TOC·메타 헤더·읽기 시간 표시 (US-002)
  - `SearchModal` 오픈 → 타이핑 → Fuse 결과 반환 → 결과 클릭 (US-003)
  - `ThemeSwitcher` 클릭 → `.dark` 클래스 토글 (US-004)
  - `ViewCounter` KV 실패 → fallback `—` 표시 (US-013 엣지케이스)
  - `getAllPosts({ includePrivate: false })` → private 포스트 미포함 (§7.5 정책 증명)
  - `getTrendingPosts()` → 조회수 내림차순 5건, private 제외 (US-016)
  - `calculateReadingTime(content)` → 한국어 500자/분 기준 결과 (US-008)
- **MSW 활용**: `/api/views` GET/POST 핸들러 모킹, 성공·실패·타임아웃 시나리오
- **원칙**: `getByRole`·`getByText`로 사용자 관점 검증. DOM 구조 의존 금지.

#### E2E (Playwright)

- **대상**: 핵심 경로 스모크 3~5종
  1. 홈 → 포스트 카드 클릭 → 상세 렌더 확인
  2. ⌘K → 검색 모달 → 타이핑 → 결과 클릭 → 상세 이동
  3. 포스트 상세 → TOC 항목 클릭 → 스크롤 이동
  4. 테마 토글 → 다크 모드 전환 → 새로고침 후 유지
  5. (옵션) 모바일 뷰포트 → 햄버거 → Drawer 열림
- **실행**: CI에서는 선택(비용 고려). 로컬 + Preview URL 대상 수동 실행 기본.

### 17.4 테스트 도구 스택

| 도구                        | 역할                         | 비고                                    |
| --------------------------- | ---------------------------- | --------------------------------------- |
| Vitest                      | 단위·Integration 테스트 러너 | Vite 기반, HMR 모드 지원                |
| @testing-library/react      | 사용자 관점 DOM 쿼리         | `getByRole`, `getByText`, `screen`      |
| @testing-library/user-event | 사용자 인터랙션 시뮬레이션   | `click`, `type`, `keyboard`             |
| MSW (Mock Service Worker)   | 네트워크 모킹                | `/api/views` 핸들러, 성공/실패 시나리오 |
| Playwright                  | E2E 브라우저 테스트          | Chromium 기본, 모바일 뷰포트 옵션       |

### 17.5 실행 명령

```bash
pnpm test           # Vitest (단위 + Integration) — watch 모드
pnpm test:run       # Vitest 일회성 실행 (CI용)
pnpm test:e2e       # Playwright (로컬 또는 Preview URL)
```

### 17.6 커버리지 정책

- **100% 커버리지를 목표로 하지 않는다.** Testing Trophy 전략상 Integration 테스트의 시나리오 커버가 라인 커버리지보다 중요하다.
- **필수 커버리지**: `features/*/services/`와 `features/*/utils/` 내 모든 export 함수는 최소 1개의 테스트를 가진다.
- **정책**: "모든 US AC에 대응하는 Integration 테스트가 존재한다"가 우선. 라인 커버리지는 참고 지표로만 사용.

**Definition of Done**: (a) 모든 P0·P1 US의 AC에 대응하는 Integration 테스트가 존재하고 녹색이다. (b) 순수 유틸 함수는 Unit 테스트가 존재한다. (c) 기능 코드 PR에 대응 테스트가 없으면 리뷰에서 차단된다. (d) `pnpm test:run`이 CI에서 녹색이다.

## 18. Milestones & Build Order

### 18.1 Page-First Skeleton 원칙

본 프로젝트는 "**모든 페이지의 껍데기를 먼저 만든다**" 원칙을 채택한다. 콘텐츠 파이프라인·검색 인덱스·KV·Giscus 같은 외부 의존을 연결하기 전에, **더미 데이터(in-memory fixtures)** 만으로 홈부터 about까지 전 화면을 렌더한다. 이 방식은 디자인 시스템·레이아웃 리듬·페이지 간 네비게이션을 M1에 조기 확정하고, 이후 M2~M4에서 각 계층을 실데이터로 교체한다. fixture는 `src/shared/fixtures/`에 격리하고 M2 진입 시 순차 제거한다. 근거는 `ADR-009` 참조.

### 18.2 Build Order

| Milestone                      | Entry 기준 | 내용                                                                                                                                                                                                                                                            | Exit 기준                                                                                      |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| M0 Foundation                  | 빈 레포    | Next 16 init · ESLint/Prettier/Lefthook · tsconfig strict · Tailwind 4 · 디자인 토큰(light/dark) · 공통 레이아웃(Header·Footer·Drawer·Container·Sidebar) · 라우팅 쉘(모든 `RT-*`)                                                                               | `pnpm dev`에서 모든 `RT-*`가 404 없이 빈 페이지로 렌더                                         |
| **M1 UI Skeleton (All Pages)** | M0         | 전 페이지 UI를 **더미 fixture**로 완성 — 홈·포스트 목록·포스트 상세(TOC·ReadingProgress·공유)·태그 허브/상세·시리즈 허브/상세·about · SearchModal · ViewCounter placeholder · Lightbox · ThemeSwitcher · MobileMenu · 모든 상태                                 | 더미 데이터 기준 모든 `FEAT-*`의 UI 요구사항 통과, 네비게이션만으로 UX 흐름 완결               |
| M2 Content Pipeline            | M1         | `contents/` submodule · `parseFrontmatter`(`--`→`---` 보정) · `calculateReadingTime` (`ADR-008`) · `copy-content-images` · `PostFrontmatterSchema` · `PostSummary`/`PostDetail` 파생 · 더미 제거 · **TDD 본격 적용 시작 — Unit + Integration 테스트 먼저 작성** | 샘플 MDX 10편이 실데이터로 렌더, `readingTimeMinutes`가 포스트별로 다름, 유틸 Unit 테스트 녹색 |
| M3 Feature Wiring              | M2         | `MOD-search` Fuse 인덱싱 · `MOD-views` KV · `MOD-comments` Giscus · `MOD-theme` persistence · `MOD-lightbox` 실이미지 · **각 기능 Integration 테스트(MSW 포함) TDD로 작성**                                                                                     | US-001~US-008 전부 통과 + 대응 Integration 테스트 녹색                                         |
| M4 Hubs & Aggregations         | M3         | 태그·시리즈 집계 · `getTrendingPosts/Series/Tags` **빌드 타임 스냅샷** (`ADR-007`) · `TrendingSnapshot` 생성 · 관련 포스트 · 인접 포스트 · **집계 로직 Unit + Private 제외 Integration 테스트**                                                                 | 홈 Popular 3블록 실데이터 렌더, US-011~US-016 통과 + 대응 테스트 녹색                          |
| M5 SEO & Syndication           | M4         | `generateMetadata` 공통 헬퍼 · JSON-LD(`BlogPosting`·`WebSite`·`BreadcrumbList`) · `/og` Edge · `/sitemap.xml` · `/rss` · `/robots.txt` · Private 정책 5군데 일관                                                                                               | Lighthouse SEO 100, Rich Results Test 통과                                                     |
| M6 A11y & Perf                 | M5         | axe 0 critical · CWV green · 폰트 서브셋 · 모션 토글 · 이미지 lazy/CLS 방지                                                                                                                                                                                     | §11·§12 NFR 통과                                                                               |
| M7 Polish                      | M6         | **E2E 스모크(Playwright) 3~5종** · P2(US-021~023) 검토 · Change Log 확정                                                                                                                                                                                        | Production 첫 배포                                                                             |

**Definition of Done**: 각 Milestone의 Exit 기준이 체크리스트로 존재하며, M1 완료 시점에 **더미 데이터 기반으로라도 전 페이지가 렌더**되어 전체 UX 흐름이 확정된다. M2~M4에서 단계적으로 외부 의존을 연결한다.

---

## 부록 A. Glossary

| 용어                 | 정의                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| SSoT                 | Single Source of Truth, 본 PRD를 가리킨다                             |
| Feature-First        | 계층(layer)이 아닌 도메인(feature) 단위로 코드를 묶는 아키텍처        |
| Public API           | `features/{name}/index.ts`에서 export된 심볼만 외부에 노출하는 패턴   |
| RSC                  | React Server Component                                                |
| Primitive Token      | 원시 색·크기 상수 (예: `blue-500`)                                    |
| Semantic Token       | 의미를 갖는 CSS 변수 (예: `--color-text-primary`)                     |
| TOC                  | Table of Contents                                                     |
| OG                   | Open Graph (소셜 공유 메타)                                           |
| KV                   | Key-Value store (Vercel KV = Upstash Redis)                           |
| Giscus               | GitHub Discussions 기반 댓글 시스템                                   |
| Submodule Workaround | Vercel 환경에서 private submodule을 clone하기 위한 토큰 주입 스크립트 |
| JTBD                 | Jobs-to-be-Done (사용자가 제품을 "고용"하는 이유)                     |
| AC                   | Acceptance Criteria                                                   |
| NFR                  | Non-Functional Requirement                                            |

## 부록 B. Decision Log (ADR-lite)

### ADR-001 Shiki over Prism.js

- **Context**: 서버 컴포넌트에서 코드 하이라이트를 수행하여 클라이언트 JS를 0에 가깝게 유지해야 함.
- **Decision**: Shiki 3 채택 (TextMate grammar 기반).
- **Consequences**: 빌드 타임이 다소 증가하지만 런타임 비용이 없다. 테마는 `github-light`/`github-dark` 듀얼.

### ADR-002 Fuse.js over MiniSearch/Algolia

- **Context**: 100~500 포스트 규모의 검색이 필요하고, 서버 의존을 피한다.
- **Decision**: Fuse.js 7 (클라이언트 fuzzy). 가중치 title 0.5 / description 0.3 / tags 0.2.
- **Consequences**: 인덱스가 모든 방문자에게 번들된다. 300KB gzipped 임계 초과 시 태그 그룹핑 청킹 전략으로 전환.

### ADR-003 Vercel KV over Upstash 직연결/SQLite

- **Context**: 조회수만 저장. 쓰기 빈도 매우 낮음.
- **Decision**: `@vercel/kv`. Vercel 프로젝트 대시보드에서 원클릭 provisioning.
- **Consequences**: 플랫폼 락인이 있으나, 키 스키마가 단순해 이관 비용이 작다.

### ADR-004 Git Submodule over Local content directory

- **Context**: 콘텐츠와 코드를 분리해 커밋 히스토리·권한을 각각 관리하고 싶다.
- **Decision**: `contents/` 별도 private 레포 + Git Submodule.
- **Consequences**: Vercel 빌드에서 토큰 기반 clone 스크립트가 필요 (§9.4).

### ADR-005 Feature-First over Layer-First

- **Context**: 혼자 운영하더라도 기능 단위 응집도를 높여 6개월 후 재검토 비용을 줄인다.
- **Decision**: `features/{domain}/{components,services,hooks,...}`.
- **Consequences**: feature 간 직접 참조가 금지되며, 공용 코드는 `shared/`로 승격한다.

### ADR-006 next-mdx-remote/rsc over @next/mdx

- **Context**: MDX 파일이 `contents/` submodule에 동적으로 존재. 빌드 타임에만 알 수 있는 경로.
- **Decision**: `next-mdx-remote/rsc`로 문자열에서 compile.
- **Consequences**: import 기반 @next/mdx의 HMR 편의는 포기하지만, 경로 유연성을 얻는다.

### ADR-007 Popular 위젯 — 빌드 타임 스냅샷

- **Context**: 홈 사이드바의 Popular Posts/Series/Tags가 의미 있는 인기 지표를 반영해야 함. 선택지: (a) 빌드 타임 스냅샷, (b) ISR 재검증, (c) 런타임 KV 실시간 조회.
- **Decision**: **빌드 타임 스냅샷**. 배포 시점에 KV 누적 조회수·포스트/태그/시리즈 집계를 한 번에 계산해 정적 JSON(`TrendingSnapshot`)으로 고정.
- **Consequences**: (a) 런타임 JS·DB 비용 0, (b) CDN 캐시 친화, (c) 최신성은 배포 주기에 종속 — 포스트 발행 push → 자동 빌드 → Popular 갱신. KV 실패 시 `popularPosts`는 최근 발행순 fallback으로 대체하고 `fallback: true` 플래그를 기록한다.

### ADR-008 읽기 시간 — 한국어 500자/분

- **Context**: 포스트 상단 "예상 읽기 시간"이 실제 본문 길이에 비례해야 함. 영어 기준 200wpm 공식은 한국어를 과소평가한다.
- **Decision**: **한국어 500자/분(공백 포함)** 을 baseline으로 채택. 공식 `readingTimeMinutes = Math.max(1, Math.ceil(chars / 500))`. 코드 블록·이미지·수식은 전처리에서 제거 후 계산. 계산은 빌드 타임 1회.
- **Consequences**: 일반 산문 기준으로 보정되어 있어 장문 기술 포스트는 약간 낙관적일 수 있음. 포스트가 늘어 편차가 눈에 띄면 `400자/분 + 코드 라인당 2자 가중`으로 전환 검토.

### ADR-009 Page-First Skeleton 개발 순서

- **Context**: 콘텐츠 파이프라인을 먼저 구축하면 UI가 비어 있는 상태가 수 주간 지속돼 디자인 일관성 검증·동기 부여가 지연된다.
- **Decision**: M1을 "모든 페이지를 **더미 데이터로 완성**"으로 정의한다. 콘텐츠·검색·KV·Giscus는 M2~M4에서 단계적으로 교체한다. fixture는 `src/shared/fixtures/`에 격리.
- **Consequences**: (a) 디자인 시스템·페이지 간 네비게이션이 조기 확정, (b) 더미 → 실데이터 교체 시 일부 컴포넌트의 props 조정이 필요(수용 가능, fixture 제거가 M2 Exit 기준), (c) "사이트 전체가 보인다"는 진척감이 1~3주 안에 확보됨.

### ADR-010 shadcn/ui (code-ownership) over 직접 구현 / Radix 직접 사용

- **Context**: Dialog·DropdownMenu·Toast·Tooltip 같은 접근성 민감 프리미티브가 필요. 선택지: (a) 자체 구현, (b) Radix UI 직접 의존, (c) shadcn/ui CLI로 복사.
- **Decision**: **shadcn/ui**. Radix + CVA + Tailwind 조합을 `src/shared/ui/`에 코드로 복사해 프로젝트가 소유한다.
- **Consequences**: (a) 업스트림 업데이트는 수동 병합 부담, (b) 커스터마이징 자유도가 최상, (c) 사용하지 않는 프리미티브가 번들에 포함되지 않음. 세부 컨벤션은 `.claude/rules/shadcn.md` 원문.

### ADR-011 next-themes over 자체 ThemeProvider 구현

- **Context**: `.dark` 클래스 토글 + `prefers-color-scheme` 감지 + hydration 안전 + View Transitions 조합을 자체 구현하면 중복·버그 위험.
- **Decision**: **next-themes** 채택. `<ThemeProvider attribute="class" enableColorScheme={false}>`로 루트 래핑, `useTheme`을 얇게 감싼 모듈 훅으로 노출.
- **Consequences**: (a) 표준 라이브러리 기반으로 유지보수 비용 감소, (b) `color-scheme`은 `.dark` 셀렉터 기반으로 CSS에서 직접 선언, (c) `useSyncExternalStore`로 mounted 감지해 FOUC·하이드레이션 불일치 방지. 세부: `.claude/rules/theme.md`.

### ADR-012 TanStack Query / SWR 미도입 (SSG-first)

- **Context**: 본 블로그는 SSG-first. 런타임 서버 상태는 `/api/views`(조회수) 하나뿐.
- **Decision**: **클라이언트 캐시 라이브러리를 도입하지 않는다**. `fetch`를 직접 호출하고 실패 시 조용한 fallback. 로딩 상태가 필요하면 `useState` + `useEffect` 또는 `useSyncExternalStore`로 충분.
- **Consequences**: (a) 번들 크기·런타임 복잡도 최소, (b) `services/`가 프레임워크 독립이라 RSC·Node 스크립트·Client 어디서든 재사용, (c) 서버 상태가 늘어나면 본 결정을 재고. 세부: `.claude/rules/project-structure.md` §8.

### ADR-013 Testing Trophy + TDD over Testing Pyramid

- **Context**: 1인 블로그에서 테스트 자원은 제한적이다. Testing Pyramid(unit 최다)를 따르면 순수 함수 unit 커버리지는 높지만, "실제 사용자 시나리오가 동작하는가"를 증명하지 못하는 거짓 안전감이 생긴다.
- **Decision**: **Testing Trophy** (Kent C. Dodds) 채택. Integration 테스트에 ~60% 비중을 두고 TDD(Red→Green→Refactor) 사이클을 기본 워크플로우로 강제한다. 도구: Vitest + @testing-library/react + MSW + Playwright.
- **Consequences**: (a) Integration 테스트가 US AC와 1:1 매핑되어 기능 회귀를 가장 빠르게 잡는다. (b) Unit 테스트는 순수 유틸에 한정해 유지보수 부담 최소. (c) E2E는 핵심 스모크만(3~5종)으로 비용 통제. (d) M1(UI Skeleton)은 TDD 예외 — 더미 데이터 기반 렌더 확인만, M2부터 본격 적용.

## 부록 C. Link Registry

| 리소스                    | URL / 경로                                         |
| ------------------------- | -------------------------------------------------- |
| Content submodule repo    | (Private, `.gitmodules` 참조)                      |
| Vercel 프로젝트           | `https://vercel.com/chan9yu/dev-blog` (owner 전용) |
| Giscus 설정               | `https://giscus.app/ko`                            |
| Speed Insights 대시보드   | Vercel Project → Insights                          |
| Rich Results Test         | `https://search.google.com/test/rich-results`      |
| Facebook Sharing Debugger | `https://developers.facebook.com/tools/debug/`     |

### 프로젝트 규칙 문서 (`.claude/rules/`)

| 파일                   | 범위                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `project-structure.md` | 3-Layer · 3 Laws · 디렉토리 · 협업 패턴 · SSG-first · 모듈 규약 |
| `typescript.md`        | strict · Non-null 금지 · Import 순서 · 배럴 규칙                |
| `react.md`             | React 19 API · Effect 규칙 · 함수 스타일                        |
| `components.md`        | Props 규약 · 복합 컴포넌트 · `"use client"` 최소화              |
| `shadcn.md`            | shadcn/ui PascalCase · CVA · 단일/Compound 패턴                 |
| `styling.md`           | 전역 CSS 위치 · 폰트 로딩                                       |
| `theme.md`             | next-themes · View Transitions · `useSyncExternalStore`         |
| `a11y.md`              | 모달·폼·토스트 a11y 세부 (ESLint plugin 보완)                   |
| `workflow.md`          | 커밋·PR 사용자 명시 요청 원칙, 문제 해결 원칙                   |

## 부록 D. Change Log

| Version | Date       | Author  | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.4.0   | 2026-04-12 | chan9yu | TDD + Testing Trophy 전략 편입: G-7 추가, §14.3 TDD 워크플로우·Trophy 다이어그램·Integration 원칙 전면 교체, §17 Testing Strategy 전면 재작성(Trophy 비중·레이어별 상세·도구 스택·커버리지 정책), §18 M2~M4에 TDD 절차·테스트 Exit 기준 반영, Tech Stack에 Vitest·@testing-library·MSW·Playwright 편입, ADR-013(Testing Trophy over Pyramid) 추가.                                                                                                |
| 0.3.0   | 2026-04-12 | chan9yu | `.claude/rules/*` 일관성 정비: Tech Stack에 shadcn/ui·class-variance-authority·next-themes 편입. §7.7 MOD-theme을 next-themes 기반으로 명시. §8.5 shadcn/ui(`shared/ui/`)·§8.6 `shared/modules/` 규약 신설. §14.6 워크플로우 규약 추가. §16을 3 Laws·명명 규칙·Feature 협업 패턴·Import 규칙·SSG-first 데이터 접근으로 확장. ADR-010(shadcn)·ADR-011(next-themes)·ADR-012(TanStack/SWR 미도입) 추가. 부록 C에 프로젝트 규칙 문서 레지스트리 편입. |
| 0.2.0   | 2026-04-12 | chan9yu | §5.5 읽기 시간 계산 규칙 + §5.6 Popular 스냅샷 계약 추가. MOD-posts에 `getTrendingPosts`·`calculateReadingTime`, MOD-tags·MOD-series에 빌드 타임 스냅샷 규칙 편입. §18 Milestones를 Page-First Skeleton 순서로 재편(M1 UI Skeleton 신설). ADR-007(빌드 타임 스냅샷)·ADR-008(한국어 500자/분)·ADR-009(Page-First) 추가.                                                                                                                            |
| 0.1.0   | 2026-04-12 | chan9yu | 초안 수립 (18 섹션 + 6 ADR + Glossary)                                                                                                                                                                                                                                                                                                                                                                                                            |
