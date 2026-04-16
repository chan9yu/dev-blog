# TASKS — chan9yu 개발 블로그

> 실행 추적용 체크리스트. 각 태스크의 상세(대응 ID·검증 기준)는 [`ROADMAP.md`](./ROADMAP.md) 참조.
>
> **상태**: `[ ]` 미착수 · `[~]` 진행 중 · `[x]` 완료

---

## M0: Foundation (1주)

> Exit: `pnpm dev`에서 모든 RT-\* 14종이 404 없이 빈 페이지 렌더

### 디자인 토큰 & 스타일

- [x] [M0-01] Primitive 색상 팔레트 (`shared/styles/tokens.css` — CSS-only, SSOT)
- [x] [M0-02] Typography 스케일 (`shared/styles/globals.css` `@theme inline` — CSS-only)
- [x] [M0-03] Semantic CSS 변수 토큰 (`shared/styles/tokens.css`)
- [x] [M0-04] 기반 스타일 (`base.css`, `animations.css`, `prose.css`, `scrollbar.css`, `shiki.css`)
- [x] [M0-05] Tailwind CSS 4 `@theme` 블록에 Semantic 토큰 연결
- [x] [M0-06] `cn()` 유틸리티 (`clsx` + `tailwind-merge`)

### 폰트 & 아이콘

- [x] [M0-07] Pretendard Variable 폰트 설정 (`next/font` localFont, `--font-pretendard` variable)
- [x] [M0-08] `lucide-react` 설치 및 아이콘 사용 패턴 확립 (`.claude/rules/icons.md`)

### 공통 레이아웃

- [x] [M0-09] `Header.tsx` — sticky 헤더, 네비/슬롯 (`shared/components/`)
- [x] [M0-10] `Footer.tsx` — 저작권, RSS 링크, "맨 위로", 소셜 슬롯
- [x] [M0-11] `Container.tsx` — 반응형 max-width 래퍼 (default 72rem / prose 44rem)
- [x] [M0-12] `Sidebar.tsx` — md+ sticky 우측, md 미만 본문 아래 자동 배치
- [x] [M0-13] `MobileMenu.tsx` — shadcn `Sheet` **직접 사용** (별도 Drawer wrapper 생략)
- [x] [M0-14] `NavLink.tsx` — `usePathname` 기반 활성 경로 하이라이트
- [x] [M0-15] `SocialLinks.tsx` — props 주입형 소셜 링크 묶음

### 라우팅 쉘 (RT-\*)

- [x] [M0-16] `RT-/` 홈
- [x] [M0-17] `RT-/posts` 포스트 목록 (metadata + canonical)
- [x] [M0-18] `RT-/posts/[slug]` 포스트 상세 (async params, slug validation + notFound)
- [x] [M0-19] `RT-/tags` 태그 허브
- [x] [M0-20] `RT-/tags/[tag]` 태그 상세 (slug validation, `#` 접두 aria-hidden)
- [x] [M0-21] `RT-/series` 시리즈 허브
- [x] [M0-22] `RT-/series/[slug]` 시리즈 상세 (slug validation)
- [x] [M0-23] `RT-/about` About
- [x] [M0-24] `RT-/rss` Route Handler (escapeXml + Cache-Control)
- [x] [M0-25] `RT-/sitemap.xml` (5 정적 경로, M5에서 동적 확장)
- [x] [M0-26] `RT-/robots.txt` (preview 차단, prod 허용)
- [x] [M0-27] `RT-/manifest.webmanifest` (PWA 기본값)
- [x] [M0-28] `RT-/og` Route Handler (Next.js 16 `cacheComponents` → node runtime)
- [x] [M0-29] `RT-/api/views` Route Handler (slug 검증 + 타입 가드, M3에서 KV 연결)

### 인프라

- [x] [M0-30] `not-found.tsx`, `loading.tsx` 글로벌 fallback (loading은 M0-16~29에서 선행)
- [x] [M0-31] `app/providers.tsx` — ThemeProvider 루트 래핑 (`next-themes` + `suppressHydrationWarning`)
- [x] [M0-32] tsconfig path alias 확인 (`@/*` → `./src/*`, src에서 23+회 사용 검증)
- [x] [M0-33] `shared/config/site.ts` — `siteMetadata`·`siteNav`·`siteSocials`·`getSiteUrl()` 확장

---

## M1: UI Skeleton — All Pages (2~3주)

> Exit: 더미 데이터 기준 모든 FEAT-\* UI 통과, 네비게이션으로 UX 흐름 완결

### Fixture 데이터

- [x] [M1-01] `shared/fixtures/posts.ts` — 더미 PostSummary 12건+
- [x] [M1-02] `shared/fixtures/post-details.ts` — 더미 PostDetail (TOC·MDX 포함)
- [x] [M1-03] `shared/fixtures/tags.ts` — 더미 TagCount
- [x] [M1-04] `shared/fixtures/series.ts` — 더미 Series
- [x] [M1-05] `shared/fixtures/trending.ts` — 더미 TrendingSnapshot

### Feature 모듈 뼈대 (index.ts)

- [x] [M1-06] `features/posts/index.ts`
- [x] [M1-07] `features/tags/index.ts`
- [x] [M1-08] `features/series/index.ts`
- [x] [M1-09] `features/search/index.ts`
- [x] [M1-10] `features/views/index.ts`
- [x] [M1-11] `features/comments/index.ts`
- [x] [M1-12] `features/theme/index.ts`
- [x] [M1-13] `features/lightbox/index.ts`
- [x] [M1-14] `features/about/index.ts`

### 공통 타입

- [x] [M1-15] `shared/types/` — PostSummary, PostDetail, TocItem, Series, TagCount, AdjacentPosts, RelatedPost, TrendingSnapshot

### 홈 (FEAT-HOME)

- [x] [M1-16] Hero 섹션 — 소개 + 프로필 이미지 + CTA
- [x] [M1-17] 최근 포스트 카드 6장
- [x] [M1-18] 사이드바 Popular Posts 5건
- [x] [M1-19] 사이드바 Trending Series 3건
- [x] [M1-20] 사이드바 Trending Tags 10건
- [x] [M1-21] 홈 반응형 레이아웃 (2-column / 1-column)

### 포스트 목록 (FEAT-POSTS-LIST)

- [x] [M1-22] `PostCard.tsx` — 썸네일/텍스트 카드
- [x] [M1-23] `PostList.tsx` — 그리드/리스트 뷰
- [x] [M1-24] 뷰 토글 (그리드/리스트) + localStorage 저장
- [x] [M1-25] 태그 필터 패널
- [x] [M1-26] 무한 스크롤 (초기 12장 + 추가 12장)
- [x] [M1-27] 빈 상태 / Suspense fallback 스켈레톤

### 포스트 상세 (FEAT-POST-DETAIL)

- [x] [M1-28] 메타 헤더 — 제목, 설명, 날짜, 읽기 시간, 태그, 조회수
- [x] [M1-29] `ReadingProgress.tsx` — 상단 프로그레스 바
- [x] [M1-30] `Toc.tsx` — sticky TOC / 접힘 Accordion
- [x] [M1-31] MDX 본문 렌더 영역 (placeholder)
- [x] [M1-32] `MdxHeading.tsx` — 자동 id + 앵커 링크
- [x] [M1-33] `ShikiCodeBlock.tsx` / `MdxPre.tsx` — 코드 블록 + 복사 버튼
- [x] [M1-34] `MdxImage.tsx` — 이미지 + Lightbox 연동 슬롯
- [x] [M1-35] `MdxLink.tsx` — 외부/내부 링크 분기
- [x] [M1-36] `MdxTable.tsx` — 반응형 테이블
- [x] [M1-37] `Callout.tsx` — 주의/팁/경고 박스
- [x] [M1-38] 시리즈 네비게이션 — 배지 + 이전/다음
- [x] [M1-39] `PostNavigation.tsx` — 이전/다음 포스트 카드
- [x] [M1-40] `RelatedPosts.tsx` — 관련 포스트 3장
- [x] [M1-41] `ShareButtons.tsx` — 복사/X/LinkedIn/Web Share
- [x] [M1-42] `ScrollToTop.tsx` — 우하단 버튼
- [x] [M1-43] `ScrollReset.tsx` — 페이지 전환 시 상단 초기화

### 태그 (FEAT-TAGS)

- [x] [M1-44] `TagHub` 페이지 — 태그 카드 그리드
- [x] [M1-45] `TagDetail` 페이지 — 태그별 포스트 목록
- [x] [M1-46] `TagChip.tsx` — 태그 칩 컴포넌트

### 시리즈 (FEAT-SERIES)

- [x] [M1-47] `SeriesHub` 페이지 — 시리즈 카드 + 미리보기
- [x] [M1-48] `SeriesDetail` 페이지 — 헤더 + 순서 네비 + 목록
- [x] [M1-49] `SeriesNavigation.tsx` — 이전/다음 시리즈 포스트

### About (FEAT-ABOUT)

- [x] [M1-50] `AboutProfile` — 프로필 + 소셜 + 마크다운 placeholder

### 검색 (FEAT-SEARCH)

- [x] [M1-51] `SearchButton.tsx` — 헤더 검색 아이콘
- [x] [M1-52] `SearchModal.tsx` — 모달 + 입력 + 결과 리스트
- [x] [M1-53] `useSearchShortcut` — Cmd+K / Ctrl+K
- [x] [M1-54] 검색 0건 상태 — 안내 + 태그 추천

### 조회수 · 테마 · 라이트박스 · 댓글

- [x] [M1-55] `ViewCounter.tsx` — 아이콘 + 숫자 placeholder
- [x] [M1-56] `ThemeSwitcher.tsx` — Sun/Moon 토글
- [x] [M1-57] `LightboxProvider.tsx` + `ImageLightbox.tsx`
- [x] [M1-58] `CommentsSection.tsx` — Giscus placeholder

### 모션 & 전환

- [x] [M1-59] `FadeInWhenVisible.tsx`
- [x] [M1-60] `PageTransition.tsx`

### shadcn/ui

- [x] [M1-61] 필요한 프리미티브 설치 (Dialog, DropdownMenu, Toast, Badge, Accordion 등)

---

## M2: Content Pipeline (1~2주) — TDD 시작

> Exit: 샘플 MDX 10편 실데이터 렌더, readingTimeMinutes 포스트별 다름, fixture 의존 제거, Unit 테스트 녹색

### Submodule

- [x] [M2-01] `contents/` Git Submodule 구성
- [x] [M2-02] `scripts/vercel-submodule-workaround.sh`

### 파싱 파이프라인 (TDD)

- [x] [M2-03] `[Red]` parseFrontmatter 테스트
- [x] [M2-04] `[Green]` parseFrontmatter 구현
- [x] [M2-05] PostFrontmatterSchema Zod 스키마
- [x] [M2-06] `[Red]` calculateReadingTime 테스트
- [x] [M2-07] `[Green]` calculateReadingTime 구현
- [x] [M2-08] `[Red]` extractTocFromMarkdown 테스트
- [x] [M2-09] `[Green]` extractTocFromMarkdown 구현
- [x] [M2-10] `[Red]` slugify 테스트
- [x] [M2-11] `[Green]` slugify 구현

### 서비스 함수 (TDD)

- [x] [M2-12] `[Red]` getAllPosts 테스트
- [x] [M2-13] `[Green]` getAllPosts 구현
- [x] [M2-14] `[Red]` getPostDetail 테스트
- [x] [M2-15] `[Green]` getPostDetail 구현
- [x] [M2-16] `[Red]` sortPostsByDateDescending 테스트
- [x] [M2-17] `[Green]` sortPostsByDateDescending 구현

### 이미지 & MDX

- [x] [M2-18] `scripts/copy-content-images.mjs` (멱등·prune)
- [x] [M2-19] `next-mdx-remote/rsc` 통합 — CustomMDX 컴포넌트 맵
- [x] [M2-20] Shiki 3 서버 하이라이팅 — `github-light`/`github-dark`
- [x] [M2-21] remark/rehype 플러그인 — `remark-gfm`, `remark-breaks`

### 더미 → 실데이터 교체

- [x] [M2-22] `generateStaticParams` 연결 (posts/[slug])
- [x] [M2-23] 홈·목록·상세에서 fixture → 실 서비스 호출
- [x] [M2-24] `src/shared/fixtures/` 의존 완전 제거

---

## M3: Feature Wiring (2주)

> Exit: US-001~US-008 전부 통과, Integration 테스트 녹색

### 검색 (MOD-search)

- [ ] [M3-01] `[Red]` useSearch Integration 테스트
- [ ] [M3-02] `[Green]` useSearch 구현 (Fuse.js)
- [ ] [M3-03] `[Red]` SearchModal Integration 테스트
- [ ] [M3-04] `[Green]` SearchModal 실 Fuse 연결

### 조회수 (MOD-views)

- [ ] [M3-05] `[Red]` KV 클라이언트 테스트 (MSW)
- [ ] [M3-06] `[Green]` KV 클라이언트 구현
- [ ] [M3-07] `[Red]` RT-/api/views Route Handler 테스트
- [ ] [M3-08] `[Green]` RT-/api/views 구현
- [ ] [M3-09] `[Red]` ViewCounter Integration 테스트
- [ ] [M3-10] `[Green]` ViewCounter 실 KV 연결

### 댓글 (MOD-comments)

- [ ] [M3-11] `[Red]` CommentsSection Integration 테스트
- [ ] [M3-12] `[Green]` CommentsSection 구현 (Giscus)

### 테마 (MOD-theme)

- [ ] [M3-13] `[Red]` ThemeSwitcher Integration 테스트
- [ ] [M3-14] `[Green]` ThemeSwitcher + useTheme 완성

### 라이트박스 (MOD-lightbox)

- [ ] [M3-15] `[Red]` ImageLightbox Integration 테스트
- [ ] [M3-16] `[Green]` ImageLightbox 구현

### 포스트 AC 완성

- [ ] [M3-17] `[Red]` PostList Integration 테스트
- [ ] [M3-18] `[Green]` PostList 실 서비스 연결
- [ ] [M3-19] `[Red]` PostDetail Integration 테스트
- [ ] [M3-20] `[Green]` PostDetail 완성

### 빌드 파이프라인

- [ ] [M3-21] `pnpm build` 통합 (submodule → copy-images → next build)

---

## M4: Hubs & Aggregations (1~2주)

> Exit: Popular 3블록 실데이터, US-011~US-016 통과, 테스트 녹색

### 태그 (MOD-tags)

- [ ] [M4-01] `[Red]` getAllTags / getPostsByTag / getTagCounts 테스트
- [ ] [M4-02] `[Green]` 태그 서비스 구현
- [ ] [M4-03] `[Red]` getTrendingTags 테스트
- [ ] [M4-04] `[Green]` getTrendingTags 구현
- [ ] [M4-05] RT-/tags + RT-/tags/[tag] generateStaticParams + 실 서비스

### 시리즈 (MOD-series)

- [ ] [M4-06] `[Red]` getAllSeries / getSeriesDetail / getSeriesStats 테스트
- [ ] [M4-07] `[Green]` 시리즈 서비스 구현
- [ ] [M4-08] `[Red]` getTrendingSeries 테스트
- [ ] [M4-09] `[Green]` getTrendingSeries 구현
- [ ] [M4-10] RT-/series + RT-/series/[slug] generateStaticParams + 실 서비스

### Popular 스냅샷 (ADR-007)

- [ ] [M4-11] `[Red]` getTrendingPosts 테스트 (KV 스냅샷 + fallback)
- [ ] [M4-12] `[Green]` getTrendingPosts 구현
- [ ] [M4-13] TrendingSnapshot 생성 로직
- [ ] [M4-14] 홈 사이드바 Popular 3블록 실데이터 교체

### 관련 · 인접 포스트

- [ ] [M4-15] `[Red]` findRelatedPostsByTags 테스트
- [ ] [M4-16] `[Green]` findRelatedPostsByTags 구현
- [ ] [M4-17] `[Red]` findAdjacentPosts 테스트
- [ ] [M4-18] `[Green]` findAdjacentPosts 구현
- [ ] [M4-19] 포스트 상세에 관련 + 인접 실데이터 연결

### About · Private 정책

- [ ] [M4-20] getAboutContent 구현 (contents/about/index.md)
- [ ] [M4-21] `[TDD]` Private 포스트 제외 정책 Integration 테스트

---

## M5: SEO & Syndication (1주)

> Exit: Lighthouse SEO 100, Rich Results Test 통과

- [ ] [M5-01] `buildMetadata` 공통 헬퍼
- [ ] [M5-02] 전 라우트에 `generateMetadata` 적용
- [ ] [M5-03] Private 포스트 `noindex` + JSON-LD 생략
- [ ] [M5-04] `WebSite` JSON-LD (루트 layout)
- [ ] [M5-05] `BlogPosting` JSON-LD (포스트 상세)
- [ ] [M5-06] `BreadcrumbList` JSON-LD (포스트/태그/시리즈)
- [ ] [M5-07] `RT-/og` Edge Handler 완성 (@vercel/og)
- [ ] [M5-08] `RT-/sitemap.xml` 완성 (priority/changefreq, private 제외)
- [ ] [M5-09] `RT-/rss` 완성 (RSS 2.0, 최신 50편, private 제외)
- [ ] [M5-10] `RT-/robots.txt` 완성

---

## M6: A11y & Perf (1주)

> Exit: NFR-001~006 전부 green, axe 0 critical

### 접근성

- [ ] [M6-01] Skip link (`<a href="#main">`)
- [ ] [M6-02] 전 버튼/아이콘에 `aria-label` 검수
- [ ] [M6-03] 모달/드로어 `role="dialog"` + 포커스 트랩
- [ ] [M6-04] 포커스 링 `focus-visible` 전역 스타일
- [ ] [M6-05] 명암 대비 검수 (4.5:1 / 3:1 / 7:1)
- [ ] [M6-06] `prefers-reduced-motion` 존중
- [ ] [M6-07] 키보드 맵 검증 (Cmd+K, Esc, 화살표, Tab)

### 성능

- [ ] [M6-08] LCP 최적화 (next/image + sharp) — < 2.5s
- [ ] [M6-09] CLS 방지 (이미지 dimension 예약) — < 0.1
- [ ] [M6-10] INP 최적화 (지연 로드) — < 200ms
- [ ] [M6-11] JS Transfer 최적화 — 홈 < 120KB gzipped
- [ ] [M6-12] 폰트 서브셋 최적화 — FOUT < 100ms
- [ ] [M6-13] Lighthouse Performance — >= 95

### 관측

- [ ] [M6-14] `@vercel/analytics` + `@vercel/speed-insights` 주입

---

## M7: Polish (지속)

> Exit: Production 첫 배포 + v1.0.0

### E2E 스모크 (Playwright)

- [ ] [M7-01] E2E: 홈 → 포스트 상세
- [ ] [M7-02] E2E: Cmd+K 검색 → 결과 클릭
- [ ] [M7-03] E2E: TOC 클릭 스크롤
- [ ] [M7-04] E2E: 테마 토글 → 새로고침 유지
- [ ] [M7-05] E2E (옵션): 모바일 Drawer

### P2 스토리

- [ ] [M7-06] US-021 OG 동적 생성 Polish
- [ ] [M7-07] US-022 RSS 구독 UI
- [ ] [M7-08] US-023 검색 추천 키워드

### Production

- [ ] [M7-09] Vercel 환경변수 전 환경 설정
- [ ] [M7-10] CI/CD 파이프라인 확정
- [ ] [M7-11] Production 첫 배포 + 24h CWV 확인
- [ ] [M7-12] Change Log 확정 + v1.0.0 태깅

---

## 진행 현황 요약

| Phase                  | 태스크  | 완료    | 진행률  |
| ---------------------- | ------- | ------- | ------- |
| M0 Foundation          | 33      | 33      | 100%    |
| M1 UI Skeleton         | 61      | 61      | 100%    |
| M2 Content Pipeline    | 24      | 21      | 88%     |
| M3 Feature Wiring      | 21      | 0       | 0%      |
| M4 Hubs & Aggregations | 21      | 0       | 0%      |
| M5 SEO & Syndication   | 10      | 0       | 0%      |
| M6 A11y & Perf         | 14      | 0       | 0%      |
| M7 Polish              | 12      | 0       | 0%      |
| **Total**              | **196** | **115** | **59%** |
