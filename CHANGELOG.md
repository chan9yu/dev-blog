# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-05-03

**🎉 첫 Production 배포** — M0~M7 전 마일스톤 완료. main 브랜치 머지로 Vercel 자동 배포 + v1.0.0 태깅.

### M7 마무리

- **[M7-09]** Vercel 환경변수 전 환경(dev/preview/prod) 매트릭스 완성 — `NEXT_PUBLIC_SITE_URL`, GISCUS 4종, KV 5종, `GITHUB_REPO_CLONE_TOKEN`.
- **[M7-10]** CI/CD 파이프라인 확정 — GitHub Actions(`ci.yaml`) + Vercel auto deploy. PR 생성 시 CI 녹색 + Preview URL, main 머지 시 Production 배포.
- **[M7-11]** Production 첫 배포 + 24h CWV 모니터링 — Speed Insights 5개 지표(LCP·INP·CLS·FCP·TTFB) green 확인.
- **[M7-12]** Change Log 확정 + v1.0.0 태깅.

### 마일스톤 누적 결과

- **M0**: Foundation (디자인 토큰, 레이아웃 7종, shadcn 설치)
- **M1**: Page-First Skeleton (홈·posts·tags·series·about 더미 fixture 완성)
- **M2**: MDX Pipeline (frontmatter 스키마, Shiki 듀얼 테마, TOC, CommonMark §6.4 우회)
- **M3**: 검색·조회수·댓글·라이트박스·테마 (Fuse.js, Vercel KV, Giscus DIY 로더, Radix Dialog 라이트박스)
- **M4**: SSG 데이터 레이어 (services 분리, ADR-007 빌드 안전 KV fallback, 시리즈/태그 분리)
- **M5**: SEO·Syndication (sitemap, RSS, JSON-LD 4종, OG Edge Route)
- **M6**: A11y & Performance (WCAG 2.1 AA, axe 0 critical, Vitals 통과)
- **M7**: Polish (E2E Playwright 5종, P2 스토리, 한글 slug 영역별 분리 정책, Production 배포)

### Added — M7 Polish 자율 영역 5건 (2026-04-27)

**M7-13 모바일 PostCard priority 정밀화** (E2E D4)

- `src/features/posts/components/PostList.tsx:124`, `RecentPostsList.tsx:67` — `priority={index < 2}` → `priority={index === 0}`
- **Why**: 모바일 1-col 레이아웃에서 두 번째 카드는 fold 아래라 `next/image` priority가 "preloaded but not used" 경고 발생. 모바일 기준 보수적 정책이 데스크톱에도 안전.

**M7-14 잘못된 slug noIndex 반환** (E2E D2)

- `src/shared/seo/build-metadata.ts` — `NOT_FOUND_METADATA` 상수 신규 (title `"404 Not Found"` + `robots noindex/nofollow`, canonical 의도적 생략)
- `src/shared/seo/index.ts` — export 추가
- `src/app/posts/[slug]/page.tsx` — `{ title: "Post" }` fallback 2곳 → `NOT_FOUND_METADATA`
- `src/app/tags/[tag]/page.tsx` — fallback 교체 + `getPostsByTag` 매칭 0건일 때도 NOT_FOUND_METADATA 반환 (페이지 자체도 `notFound()`)
- `src/app/series/[slug]/page.tsx` — fallback 교체
- **Why**: 검색엔진이 "Post"/"Tag"/"Series" 단어가 박힌 빈 페이지를 인덱싱할 위험. 명시적 noindex/nofollow로 SEO 위생 강화.

**M7-08 검색 추천 키워드** (US-023)

- `src/features/search/components/SearchSuggestions.tsx` (신규) — 빈 검색창에서 인기 태그 5개(빈도순) + 최근 포스트 3개(date desc) 표시. 모든 항목이 `<a>` 링크라 SearchModal Arrow 키 내비게이션에 자연 편입.
- `src/features/search/components/SearchModal.tsx` — trimmed === "" && !hasPendingInput 분기에 `<SearchSuggestions>` 삽입. Arrow 키 핸들러를 `event.currentTarget.querySelectorAll("a[href]")`로 변경해 추천·결과 영역 통합 순회 (`listRef` 제거).
- `src/features/search/components/index.ts` — export 추가
- `__tests__/SearchModal.test.tsx` — 빈 상태 안내 메시지 검증 → 추천 영역 heading 검증으로 갱신, ArrowDown 추천 영역 포커스 이동 신규 테스트.

**M7-07 RSS Footer 노출 보강** (US-022)

- `src/shared/components/layouts/Footer.tsx` — `FOOTER_LINKS`에 `icon?: ReactNode` 필드 추가, RSS는 `external: true` + `Rss` 아이콘 prefix. nav 정렬 `items-center` + link `inline-flex items-center gap-1.5`로 아이콘·텍스트 정렬.
- **Why**: `/rss`는 XML 응답이라 같은 탭에서 열면 raw XML이 노출되는 UX 회귀. 새 탭으로 분리.
- **Header 미추가 결정**: Header 슬롯 패턴(`searchSlot`/`themeSlot`/`mobileMenuSlot`)은 features 도메인 주입용. 도메인 없는 단순 RSS 링크로 슬롯을 늘리면 책임 흐름이 흐려져 Footer 단일 노출 유지.

**M7-06 OG 동적 생성 디자인 Polish** (US-021)

- `src/app/og/route.tsx` — MAX_TITLE 120 → 80, MAX_TAG 40 → 32, `truncate()` 헬퍼 추가(`…` 말줄임표), 빈 title fallback, fontSize 72 → 64, line-height 1.1 → 1.18, padding 80px 96px → 72px 88px, eyebrow 분기 단순화.
- **Why**: satori 기본 폰트 환경에서 한글 fallback 가독성 향상. fontSize 축소·line-height 증가로 한글 받침 잘림 방지.
- **이월**: Pretendard subset .otf 임베딩은 폰트 자산 추가가 필요해 별도 후속 (사용자 승인 영역).

### Fixed — M7 자율 영역 3-way REVIEW 핑퐁 적용 (2026-04-27)

react-nextjs-code-reviewer + a11y-auditor + compound-reviewer 3-way 병렬 리뷰 결과 Tier 1 1건 + Tier 2 3건 발견·수정.

- **[Tier 1] SearchSuggestions 정렬 가정 제거** — `posts.slice(0, 3)`이 호출 측 date desc 정렬 계약을 신뢰하던 문제. 컴포넌트 내부에서 `[...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)`로 명시 정렬.
- **[Tier 2] framer-motion ease 상수 공용화** — `[0.4, 0, 0.2, 1] as [number, number, number, number]` inline tuple이 `PostList`/`RecentPostsList`/`SearchModal` 3파일에 산재. `src/shared/utils/motion.ts`에 `EASE_OUT` 상수 추출 → 3파일 모두 import.
- **[Tier 2] containerVariants.hidden 누락 비대칭 수정** — `RecentPostsList`엔 `hidden: {}` 명시되었으나 `PostList`·`SearchModal listVariants`에는 누락. variants 자식 상속 보장 위해 동일 패턴으로 일치.
- **[Tier 2] SearchModal Arrow 키가 추천 영역 미편입** — `listRef` 기반 셀렉터가 결과 ul만 스캔해 빈 검색창 추천 링크는 키보드 순회 불가. `event.currentTarget` 기반으로 변경해 Dialog.Content 전체의 a[href] 통합 순회.

**Tier 3는 GC 사이클 이월**: `getPublicPosts()` `React.cache()` 적용, JSDoc 군더더기 정리, `NOT_FOUND_METADATA`에 `alternates: { canonical: null }` 명시 등.

### Added — M7-01~05 E2E Playwright 셋업 (2026-04-27)

- `package.json` — `@playwright/test ^1.59.1` devDependency 추가, `test:e2e` / `test:e2e:ui` 스크립트
- `playwright.config.ts` (신규) — port 3100 baseURL, chromium + mobile-chromium(Pixel 7) 두 project, webServer reuseExistingServer, trace on-first-retry, screenshot only-on-failure
- `e2e/home.spec.ts` (M7-01) — 홈 첫 포스트 카드 → 상세. `a[href^="/posts/"]` selector + `Promise.all([waitForURL, click])` 패턴으로 클릭 후 navigation 안정화
- `e2e/search.spec.ts` (M7-02) — Meta+K/Control+K 모달 → 추천 영역 노출 → 결과 클릭 이동, ESC 닫기 (2건)
- `e2e/toc.spec.ts` (M7-03) — TOC 항목 클릭 → 한글 anchor percent-encoded URL 비교 + heading viewport 진입 검증. attribute selector(`[id="..."]`)로 한글 id escape 우회
- `e2e/theme.spec.ts` (M7-04) — 테마 토글 → `expect.poll`로 View Transitions 비동기 종료 대기 → 새로고침 후 다크 클래스 유지 검증
- `e2e/mobile-menu.spec.ts` (M7-05) — `test.use({ ...devices["Pixel 7"] })`로 단일 chromium project 안에서 viewport 격리. 햄버거 → drawer 노출 → ESC 닫기
- `.gitignore` — `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/` 추가

**최종 결과**: 6/6 tests PASS (14.7s)

### Fixed — 한글 태그 표시 일관성 (2026-05-03)

- **회귀**: 한글 slug 정규화(`/tags/항해-플러스-프론트엔드-6기`) 후 `/tags/[tag]` 상세 page만 `formatLocalizedSlug`로 hyphen→공백 변환됐고, **다른 표시 지점은 hyphen 그대로 노출**되어 UI 일관성 깨짐.
- **fix**: 7개 표시 지점에 `formatLocalizedSlug` 일괄 적용.
  - `src/features/tags/components/TagList.tsx` (사이드바·태그 목록)
  - `src/features/tags/components/TrendingTags.tsx` (트렌딩 태그 + aria-label)
  - `src/features/tags/components/TagChip.tsx` (태그 칩 라벨 + aria-label)
  - `src/features/posts/components/PostCard.tsx` (카드 태그 칩)
  - `src/features/posts/components/PostMetaHeader.tsx` (포스트 상세 메타 태그 링크)
  - `src/features/search/components/SearchSuggestions.tsx` (검색 모달 트렌딩 태그)
  - `src/app/tags/page.tsx` (태그 허브 카드 h2)
- **검증**: 데스크톱 dev server에서 Playwright MCP로 5개 지점 텍스트 추출 — 모든 표시가 `항해 플러스 프론트엔드 6기` 자연스러운 공백 라벨, URL은 hyphen 정규화 유지(`/tags/항해-플러스-프론트엔드-6기`).
- `pnpm lint` PASS.

### Fixed — Playwright MCP 전수 E2E 회귀 (2026-05-03)

- **회귀 1: PostList/RecentPostsList priority 정책** — M7-13 fix(`priority={index === 0}`)가 framer-motion 진입 애니메이션·`Suspense`+Client hydration·hero 아래 below-the-fold 등 다수 요인과 상충해 dev/prod 모두 `<link rel="preload"> ... not used within window's load event` 경고 발생. 모든 PostList 사용 페이지(/posts·/tags/[tag])에서 첫 카드는 below-the-fold이고, /의 RecentPostsList도 hero 아래라 priority preload가 unused로 보고됨.
- **fix**:
  - `src/features/posts/components/PostList.tsx` — 첫 카드는 framer-motion 우회로 paint timing만 안정화, priority preload 정책은 폐기. parent `motion.div`도 `initial={false}`로 자식 paint 지연 차단.
  - `src/features/posts/components/RecentPostsList.tsx` — 동일.
  - `src/features/posts/components/PostCard.tsx` — `loading={priority ? "eager" : "lazy"}` 명시 추가 (priority hint와 loading 속성 일관 유지, 향후 옵트인 시 안전).
- **회귀 2: Vercel Analytics 404** — 로컬 `pnpm start`에서 `/_vercel/insights/script.js`·`/_vercel/speed-insights/script.js` 404 에러 발생. Vercel 호스트가 아니라 endpoint 부재.
- **fix**:
  - `src/app/layout.tsx` — `process.env.VERCEL` 가드로 Vercel 환경에서만 마운트. 로컬 prod 검증·CI에서 false error 차단.
- **검증**: Playwright MCP로 `/`·`/posts`·`/posts/webrtc-deepdive-01`·`/tags/회고`·`/tags/항해-플러스-프론트엔드-6기`·`/series/WebRTC-박살내기`·`/series/항해-플러스-프론트엔드-6기`·`/about` 8개 라우트 prod 빌드 + 데스크톱(1280×720) + 모바일(390×844) 두 viewport에서 hard reload 후 전수 검증 → **에러 0, 경고 0**. SPA 잔여 prefetch는 hard reload 시 자동 해소.

### Decided — M7-15 한글 slug 영역별 분리 정책 (2026-05-03)

- **결정**: 2026 best practice 리서치(Google Search Central + 다국어 SEO 가이드 + velog/tistory ecosystem + RFC 3986 종합) 후 **영역별 분리** 정책 채택.
  - **포스트 slug** (`/posts/{slug}`): 영문 kebab-case 강제 — 디렉토리=URL 도구·CDN 호환 우선
  - **태그·시리즈 slug**: 한글 허용 + 공백→hyphen 정규화 + RFC 3986 sub-delim(`!`·`?`·`#` 등) 제거
- **근거 출처**:
  - Google Search Central: "Use words in your audience's language in the URL" + "non-ASCII range should be percent encoded"
  - velog (한국 1위 dev blog): `/tags/리액트` 형태로 한글 URL 표준 사용 + 한국어 검색 인덱싱 정상
  - SimpleLocalize/Search Engine Journal: 청중이 특정 언어 화자면 번역 slug가 UX·SEO 유리. Ahrefs는 메인 영문 + 콘텐츠 청중 언어 (혼합 전략)
- **적용 변경**:
  - `_workspace/normalize-slug-spaces.mjs` 신규 — 시리즈·태그 frontmatter 공백→hyphen + 특수문자 제거 정규화 스크립트
  - `contents/` submodule — 14개 mdx 정규화. 시리즈: `WebRTC 박살내기!` → `WebRTC-박살내기`, `항해 플러스 프론트엔드 6기` → `항해-플러스-프론트엔드-6기`. 태그: `항해 플러스 프론트엔드 6기` → `항해-플러스-프론트엔드-6기`. 다른 한글 태그(`회고`·`항해99` 등)는 공백 없어 무변경
  - `src/shared/utils/formatLocalizedSlug.ts` 신규 — 한글 포함 slug에서 hyphen→공백 자동 역변환. 영문 kebab-case는 그대로 보존
  - `src/shared/utils/__tests__/formatLocalizedSlug.test.ts` 신규 — 4 케이스 단위 테스트
  - `src/features/series/services/getAllSeries.ts` — `name: formatLocalizedSlug(seriesId)` (표시), `slug: seriesId` (URL) 분리
  - `src/app/tags/[tag]/page.tsx` — `decoded`(URL용)·`display`(표시용) 분리, h1·title·breadcrumb 모두 `display` 사용
  - `next.config.ts` — `KOREAN_SLUG_REDIRECTS` 11종 + `redirects()` 제거 (직전 영문화 시도분)
  - `.claude/rules/seo.md` — Slug & URL 규약을 영역별 분리 매트릭스로 재작성. RFC 3986 sub-delim 명시. `formatLocalizedSlug` 참조 추가
  - `.claude/rules/mdx-content.md` — `tags` 한글 허용·공백 금지 명시, `series` 정규화 의무 명시
- **검증**: `pnpm build` PASS — `/series/WebRTC-박살내기`·`/series/항해-플러스-프론트엔드-6기` 정규화 URL 정상 prerender. `pnpm lint` PASS, `pnpm test` PASS (formatLocalizedSlug 4 신규 + 기존), `pnpm test:e2e --project=chromium` 6/6 PASS.
- **이전 시도 자료 보존**: `_workspace/migrate-korean-slugs.mjs`(영문화) + `_workspace/rollback-korean-slugs.mjs`(롤백) + `_workspace/normalize-slug-spaces.mjs`(최종 정규화) 3 스크립트 유지 — 결정 이력.

### Notes — Turbopack 빌드 캐시 stale 회귀 (2026-04-27)

- `pnpm add -D @playwright/test` 실행 직후 Turbopack이 `@vercel/analytics/next`·`@vercel/speed-insights/next` sub-export를 못 찾는 회귀 발생.
- node_modules sub-export는 정상 (분석 결과 두 패키지 모두 `./next` export 존재). 원인: `.next/` 빌드 캐시가 stale.
- 해결: `rm -rf .next && pnpm build` 재실행으로 정상 복구.
- **GC 후속**: 의존성 변경 시 `.next/` 자동 invalidation 검토.

### Fixed — M6 E2E 발견 결함 즉시 수정 (T1, 2026-04-27)

- **D3 aria-modal 명시** — 모든 Radix Dialog 기반 모달에 `aria-modal="true"` prop 추가:
  - `src/shared/components/ui/Dialog.tsx` (`DialogPrimitive.Content`) — SearchModal·일반 Dialog 사용처 일괄 적용
  - `src/shared/components/ui/Sheet.tsx` (`SheetPrimitive.Content`) — MobileMenu Sheet 적용
  - `src/features/lightbox/components/ImageLightbox.tsx` (`DialogPrimitive.Content`) — 라이트박스 직접 적용
  - **Why**: WCAG 2.1 4.1.2. Radix Dialog는 inert/포커스 트랩으로 격리하지만 `aria-modal` 속성을 명시 추가하지 않아 일부 스크린리더가 모달 외부 콘텐츠를 계속 읽을 위험. ROADMAP M6-03 명시 요구사항 충족 강화.
  - **Verify**: Playwright `dom.querySelector('[role="dialog"]').getAttribute('aria-modal')` = `"true"` 확인 (SearchModal/MobileMenu/ImageLightbox 3곳).

- **D6 브랜드 title 통일** — `src/shared/config/site.ts` `siteMetadata.title`:
  - `"chan9yu | 기술 개발 블로그"` → `"chan9yu | 프론트엔드 개발 블로그"`
  - **Why**: RSS·manifest·OG 기본값(site.ts 사용)과 홈 page metadata(`app/page.tsx` 직접 override) 사이 브랜드 불일치. SNS 공유 시 제목 일관성 저해.
  - **Verify**: production 빌드 결과 `.next/server/app/rss.body` `<title>chan9yu | 프론트엔드 개발 블로그</title>` 확인 + manifest.name 일치.

### Documented — M7 신규 태스크 등록 (2026-04-27)

- **M7-13** 모바일 PostCard priority 정책 정밀화 (E2E D4 회귀 — `priority={index < 2}`가 모바일에서 unused preload 경고)
- **M7-14** 잘못된 slug `generateMetadata` noIndex 반환 (E2E D2 — 404 page title 누설)
- **M7-15** 한글 slug 영역별 분리 정책 (E2E D1 / 2026 best practice 리서치 후 채택)

### Added — M6-01~13 A11y & Perf 검증·보강 (2026-04-27)

**M6-01 Skip link** — 검증 완료. `src/app/layout.tsx:85-90` 이미 `<a href="#main-content">본문 바로가기</a>` + `sr-only`/`focus-visible:not-sr-only` 패턴 적용, `<main id="main-content" tabIndex={-1}>`가 포커스 수신.

**M6-02 aria-label 검수** — 검증 완료. 단독 아이콘 button/Link 전수 점검:

- `ScrollToTopButton` `aria-label="맨 위로 이동"` ✅
- `SearchModal` Close `aria-label="검색 닫기"` ✅
- `MobileMenu` Trigger `aria-label={triggerLabel}` ✅
- `ImageLightbox` 좌·우·닫기 모두 한국어 aria-label ✅
- `SocialLinks`: 텍스트 동반 — 아이콘 `aria-hidden` 정책 일관 ✅
- `RecentPostsList` 뷰 토글 시 `role="status" aria-live="polite"` 알림 ✅

**M6-03 모달/드로어 포커스 트랩** — 모든 오버레이가 Radix Dialog primitive 기반:

- `SearchModal` → `shared/components/ui/Dialog` (Radix wrapper)
- `MobileMenu` → `Sheet` (Radix Dialog)
- `ImageLightbox` → `radix-ui` Dialog primitive 직접 사용 — 포커스 트랩·ESC·body scroll lock·포커스 복원·`Title`/`Description` sr-only 모두 자동
- 추가로 `ImageLightbox`는 ArrowLeft/ArrowRight 키보드 nav `useEffect`로 직접 구현

**M6-04 focus-visible 전역** — 검증 완료. `globals.css:25-29`에 `@layer base { :focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-sm); } }`. 다크 모드는 `--color-focus-ring`이 `#818cf8`로 자동 전환.

**M6-05 명암 대비 검증** — 검증 완료. `tokens.css` Light/Dark 토큰 분석:

| 조합                             | Light  | Dark   | WCAG     |
| -------------------------------- | ------ | ------ | -------- |
| `text-primary` on `bg-default`   | ~16:1  | ~17:1  | AAA      |
| `text-secondary` on `bg-default` | ~7.5:1 | ~12:1  | AAA      |
| `text-tertiary` on `bg-default`  | ~5.0:1 | ~7.5:1 | AA / AAA |
| `accent` on `bg-default`         | ~7:1   | ~7:1   | AAA      |
| `text-disabled` on `bg-default`  | ~3.0:1 | ~4.5:1 | UI 면제  |

본문 4.5:1, 대제목 3:1 모두 충족. text-disabled는 disabled 상태로 WCAG 1.4.3 면제.

**M6-06 prefers-reduced-motion 3중 방어선**:

- `base.css:79-88` 글로벌 `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; ... } }` — 모든 애니메이션·트랜지션 즉시 단축
- `animations.css:113-124, 151-156` View Transitions API + scroll-driven animation 별도 처리 (`*` selector 미포함 영역)
- `app/providers.tsx:26` `<MotionConfig reducedMotion="user">` framer-motion 자동 비활성

**M6-07 키보드 맵 검증** — 코드 점검 통과:

- ⌘K/Ctrl+K → `useSearchShortcut` 활성화, `SearchTrigger`가 모달 open
- Esc → Radix Dialog 자동 처리 (SearchModal·MobileMenu·ImageLightbox 공통)
- ArrowLeft/ArrowRight → `ImageLightbox` `useEffect` 핸들러 (circular)
- ArrowUp/ArrowDown → `SearchModal` 결과 리스트 순환 + 입력창 위 가드
- Tab → focus-visible 글로벌 + skip link → main → header 순 자연 흐름

**M6-08 LCP 최적화** — `next/image` priority 정책 일관:

- `posts/[slug]/page.tsx:129` thumbnail `priority` ✅
- `RecentPostsList:67`, `PostList:124` `priority={index < 2}` ✅
- `PostCard:71-94` priority prop forward ✅
- `next/image`는 sharp 자동 의존 (Next.js 16 빌트인). `outputFileTracingExcludes`로 lambda 사이즈 방어 (M5에 도입됨, 회귀 없음)

**M6-09 CLS 방지** — 이미지 dimension 예약:

- 모든 `<Image fill sizes="...">` 패턴 — 부모 wrapper의 `aspect-*` 클래스로 dimension 예약
- 폰트 swap 안정화 — `localFont`에 `adjustFontFallback: "Arial"` 적용 (`layout.tsx:28`)
- **잔여 위험**: `MdxImage`는 width/height 미지정 (`<img>` 직접 사용). 본문 주석에 "M4+ remark 플러그인으로 dimension 주입 시 next/image 복귀" 명시 — M7 후속 처리 권고

**M6-10 INP 최적화** — 무거운 클라이언트 모듈 lazy load 전수 적용:

- `LightboxProvider:11` `ImageLightbox` `dynamic({ ssr: false })` ✅
- `CommentsSection:65-83` IntersectionObserver lazy mount + Giscus script DIY 주입 ✅
- `SearchTrigger.tsx` (변경) — `SearchModal`을 `next/dynamic({ ssr: false })`로 분리, `{open && <SearchModal />}` 가드. 첫 진입 시 fuse.js·framer-motion·Dialog 코드 번들 제외 → 초기 First Load JS 감소.

**M6-11 JS Transfer 분석** — 빌드 청크 baseline:

- `.next/static/chunks` 총 1.0MB (uncompressed) / 청크 16개
- 가장 큰 청크 222KB (vendor 통합 추정)
- `cacheComponents`(Next 16) + Turbopack tree shake로 페이지별 자동 분할
- 정확한 First Load JS gzip 측정은 M6-13 가이드대로 Lighthouse / M6-14 Speed Insights에 위임 (로컬 CLI 분석 도구 미도입 결정)

**M6-12 폰트 서브셋** — 현상 유지 결정 (사용자 승인):

- `PretendardVariable.woff2` 2.0MB / `localFont` `display: "swap"` + `preload: true` + `adjustFontFallback: "Arial"`
- swap 전략으로 FOUT < 100ms 충족, 서브셋 교체는 M7 Polish에서 LCP 측정 후 재평가

**M6-13 Lighthouse 측정 가이드** — `docs/PERFORMANCE_AUDIT.md` (신규):

- 측정 환경(Chrome Incognito + Mobile Moto G Power + Slow 4G + 4x CPU throttle)
- 필수 라우트 5종(`/`·`/posts`·`/posts/{slug}`·`/tags`·`/about`)
- 합격 기준 (Performance >= 95, NFR-001~006 매트릭스)
- 회귀 신호별 진단 가이드 (LCP/CLS/INP/JS Transfer)
- M7-11 production 24h CWV 검증 절차 안내
- @lhci/cli 도입은 M7-10 영역으로 이월

**M6-14 Vercel Analytics + Speed Insights 주입**:

- 의존성: `@vercel/analytics@^2.0.1` + `@vercel/speed-insights@^2.0.0` (사용자 직접 `pnpm add`, settings 권한 정책)
- `src/app/layout.tsx` — `<Analytics />` + `<SpeedInsights />` 주입 (`</body>` 직전, `Providers` 외부). `@vercel/analytics/next`·`@vercel/speed-insights/next` Next.js 16 전용 entrypoint 사용.
- 자동 수집: pageview·웹 비탈(LCP/CLS/INP/TTFB/FCP). Vercel 배포 환경에서만 송신, 로컬 개발은 no-op. M7-11 production 24h CWV 검증의 데이터 소스.
- 빌드 검증: `pnpm build` 통과 (101 정적 페이지, Cache Components 정상)

### Added — M5-01~10 SEO & Syndication 인프라 (Green, 2026-04-26)

**M5-01 buildMetadata 공통 헬퍼**:

- `src/shared/seo/build-metadata.ts` (신규) — `buildMetadata({ title, description, path, image?, type?, publishedAt?, modifiedAt?, authors?, tags?, noIndex? }): Metadata`. 모든 라우트의 `generateMetadata`에서 호출하는 단일 진입점.
- `__tests__/build-metadata.test.ts` (8 케이스) — title/canonical/og/twitter 매핑·image fallback(`/og?title=...`)·article 분기·noIndex.
- **OpenGraph union 분기 안전성**: `Metadata["openGraph"]`가 `OpenGraphWebsite | OpenGraphArticle` union이라 객체 mutation 방식은 직렬화 시 타입 분기 손실 위험. 처음부터 `type === "article" ? {…article} : {…website}` 갈래로 build해 `<meta property="article:published_time">` 출력 보장.

**M5-04~06 JSON-LD 빌더 (`shared/seo/json-ld.ts`)**:

- `buildWebSiteJsonLd` — schema.org WebSite + Person(author) + inLanguage="ko-KR"
- `buildBlogPostingJsonLd` — headline·datePublished·dateModified?·author·keywords·image(absolute)·url·mainEntityOfPage
- `buildBreadcrumbJsonLd` — ListItem 배열 (절대 URL)
- `buildPersonJsonLd` — name·url?·sameAs?
- `JsonLdScript.tsx` — `<script type="application/ld+json">` 인라인 주입. `<` → `<` 이스케이프로 `</script>` XSS 방어.
- `__tests__/json-ld.test.ts` (6 케이스) — 4종 빌더 직렬화 + 절대 URL 변환 + 옵션 필드 분기.

**M5-02 전 라우트 generateMetadata 마이그레이션**:

- `src/app/{page,posts/page,tags/page,series/page,about/page}.tsx` — 모두 `buildMetadata({…})` 통과
- `posts/[slug]/page.tsx` — `getPostBySlug` → `getPostDetail`로 전환(private 포스트 직접 URL 접근 200 허용 + noIndex), `type: "article"` + `publishedAt`/`authors`/`tags` 주입
- `tags/[tag]/page.tsx`, `series/[slug]/page.tsx` — buildMetadata 적용
- `not-found.tsx`는 `robots: { index: false, follow: false }` 그대로 유지

**M5-03 Private 포스트 noindex + JSON-LD 생략**:

- `posts/[slug]/page.tsx` generateMetadata에서 `noIndex: post.private` 전달 → `<meta name="robots" content="noindex, nofollow">` 자동 출력
- BlogPosting/Breadcrumb JSON-LD는 `summary.private`이면 미렌더 (조건부 분기)
- M4-21 통합 테스트로 `getPublicPosts`/`findAdjacent`/`findRelated`/`getAllSeries`/`getTagCounts`/`getTrendingTags`/`getTrendingSeries` 7개 collector가 private 누설 안 한다는 사실 이미 보장됨

**M5-04 WebSite JSON-LD (root layout)**:

- `app/layout.tsx` — `<body>` 첫 자식에 `<JsonLdScript id="website-json-ld">` 주입. 모든 페이지에 1회 노출.
- root metadata도 `ROOT_OG_IMAGE = /og?title=${name}` 상수로 통일 (twitter/openGraph 동일 경로)

**M5-05 BlogPosting JSON-LD (포스트 상세)** + **M5-06 BreadcrumbList JSON-LD (3종 상세)**:

- `posts/[slug]/page.tsx` — BlogPosting + Breadcrumb 2종 인젝션 (private 미렌더)
- `tags/[tag]/page.tsx` — Breadcrumb (홈→태그→#{tag})
- `series/[slug]/page.tsx` — Breadcrumb (홈→시리즈→{name})
- `about/page.tsx` — Person JSON-LD + sameAs(소셜 링크 전부) — 저자 E-E-A-T 신호

**M5-07 `/og` Edge Handler 완성**:

- `src/app/og/route.tsx` — `searchParams: title (120자 truncate), tag? (40자), thumbnail?`.
  - thumbnail이 절대 URL → `Response.redirect(thumbnail, 302)` (프록시 비용 회피)
  - thumbnail이 `/posts/...` 상대 경로 → 같은 origin 절대화 후 redirect
  - 미지정 → ImageResponse 1200×630, 다크 그라디언트(`#0f172a → #1e1b4b → #4f46e5`), title 72px 800w, tag 24px 600w, 사이트명 22px
- TODO(M7-06): satori는 woff2 미지원 → 한글 폰트 임베딩(Pretendard subset .otf) Polish

**M5-08 동적 sitemap (`src/app/sitemap.ts` + `sitemap-entries.ts`)**:

- `buildSitemapEntries({ siteUrl, publicPosts, tags, series })` — PRD §10.4 priority/changefreq 표 그대로:
  - / 1.0 daily · /posts 0.9 daily · /posts/[slug] 0.8 weekly · /series 0.7 weekly · /series/[slug] 0.6 weekly · /tags 0.6 weekly · /tags/[tag] 0.5 weekly · /about 0.5 monthly
- `sitemap.ts` default export는 `getPublicPosts()` + `getAllTags()` + `getAllSeries()` 조립 — private 자동 제외
- `__tests__/sitemap-entries.test.ts` (6 케이스) — 정적 priority·post lastModified=frontmatter.date·URL encode·private 미포함

**M5-09 RSS 2.0 (`src/app/rss/route.ts` + `rss-feed.ts`)**:

- `buildRssFeed({ siteUrl, siteTitle, siteDescription, authorName, authorEmail, locale, posts })` — RSS 2.0 표준 channel + atom:link self
- 항목당: title·link·guid(isPermaLink="true")·description·pubDate(RFC 822)·author(`email (name)`)·category(태그)
- 최대 50편 (RSS_ITEM_LIMIT) — 호출자가 private 제외 (`getPublicPosts`)
- XML 특수문자 5종 escape
- `__tests__/rss-feed.test.ts` (5 케이스) — 채널 메타·item 형식·RFC 822 pubDate·escape·50개 절단

**M5-10 robots.txt 완성**:

- production: `allow: /` + `disallow: /api/` + `sitemap: getSiteUrl()/sitemap.xml`
- preview/local: `disallow: /` (검색엔진 색인 차단)
- private slug 별도 Disallow 불필요(sitemap에서 이미 제외) — PRD §10.6

**3-way 리뷰 결과**:

- react-nextjs-code-reviewer: Tier 1 1건(buildMetadata article OG 캐스팅) → 빌드 출력 검증으로 false positive 확인됐으나 명료성 위해 union 분기 패턴으로 리팩토링
- seo-auditor: FIX 판정 — Description 6개 페이지 120자 미달 + About Person JSON-LD 누락 → 모두 즉시 수정 (site.ts/page/posts/tags/series/about)
- a11y-auditor: Tier 1 위반 0건. Tier 2 (tags/series JSX 인덴트 단절 위험) → 즉시 정리
- 후속(별도 GC 작업): `.claude/rules/seo.md`의 `next/script strategy="afterInteractive"` 규약이 실제 구현(일반 script + dangerouslySetInnerHTML)과 불일치 — autonomy.md상 사용자 승인 필요 영역, 별도 처리

**검증**:

- `pnpm tsc --noEmit` 통과 (strict)
- `pnpm test` 245/245 PASS (M5 신규 25케이스: build-metadata 8 + json-ld 6 + sitemap-entries 6 + rss-feed 5)
- `pnpm lint` 0 errors
- `pnpm build` 101/101 정적 페이지 PASS, 빌드 출력에서 `<meta property="article:published_time">`·canonical·og:image:width=1200 등 정상 노출 확인

**설계 근거**:

- buildMetadata가 path만 받고 `/og?title=...`로 fallback — 모든 페이지가 OG 이미지 자동 보장 (썸네일 없는 시리즈 허브·태그 페이지에서도 1200×630 미리보기)
- JSON-LD는 `next/script` 대신 일반 `<script>` 인라인 — 검색 크롤러는 즉시 파싱 필요 (afterInteractive 지연과 부합 안 함)
- `getPostDetail`로 변경(getPostBySlug 아님) — private 포스트 직접 URL 접근 시 noIndex로 200 응답 (PRD §13.3)
- sitemap-entries/rss-feed가 `app/`에 위치 — Next.js metadata route(`sitemap.ts`/`rss/route.ts`)와 같은 디렉토리에 묶어 빌드 책임 영역 일치 (3-way 리뷰의 shared/seo 이동 권고는 후속 GC로 위임)

### Added — M4-20~21 About 콘텐츠 + Private 정책 통합 테스트 (Green, 2026-04-25)

**M4-20 About 콘텐츠 (PRD §7.9)**:

- `src/features/about/services/getAboutContent.ts` (신규) — `() => string`. `contents/about/index.md` 본문을 sync fs로 읽어 raw markdown string 반환. 파일 누락 시 throw — 빌드 시점 즉시 감지(silent fail 방지).
- `src/features/about/services/__tests__/getAboutContent.test.ts` (3 케이스) — 본문 반환·utf-8 인코딩·ENOENT throw
- `src/features/about/index.ts` — `getAboutContent` Public API export
- `src/features/about/components/AboutProfile.tsx` — 하드코딩된 80+ 줄 placeholder 본문(인사·기술스택·블로그·연락) → `<CustomMDX source={getAboutContent()} />` 단일 호출로 교체. 프로필 메타(이름/직함/소셜)는 1인 블로그 특성상 inline 유지.

**M4-21 Private 정책 통합 테스트**:

- `src/features/posts/services/__tests__/privatePolicy.integration.test.ts` (신규, 8 케이스) — 단일 fs mock 픽스처(public-a, public-b, private-x)로 모든 collector 누설 검증
  - `getPublicPosts()` 자체 private 제외
  - `includePrivate: true` 반대 케이스
  - `findAdjacentPosts` private 미포함
  - `findRelatedPostsByTags` private 미포함 + secret 태그 누설 차단
  - `getAllSeries` 시리즈 그룹에 private 미포함
  - `getTagCounts` private 기여분 미합산 + secret 태그 미등장
  - `getTrendingTags` private 기여분 제외
  - `getTrendingSeries` 소속 포스트 수 정확

**3-way 리뷰 결과**:

- Tier 1: 1건 false positive (`React.cache` 격리 우려 → 빌드/테스트 220/220 PASS로 실제 격리 정상 검증)
- Tier 2 즉시 수정: 라인 106 중복 assertion 정리 + secret 태그 누설 검증으로 교체 (양성 케이스 확장)
- Tier 2 후속(별도 트랙):
  - `getAboutContent` async/await + `readFile` 전환 — ISR 전환 시점에 적용 (현재 SSG 전용 빌드 타임만 호출되므로 무해)
  - `privatePolicy.integration.test.ts` → `src/__tests__/integration/`으로 이동 — 통합 테스트 디렉토리 신설은 testing.md 갱신 필요(별도 GC 작업)

**검증**: `pnpm test` 220/220 PASS(getAboutContent 3 + privatePolicy 8 신규), `pnpm build` 101/101 정적 페이지(About 페이지 ○ Static 그대로), `/about` 마크다운 렌더 정상 동작.

**설계 근거**:

- `getAboutContent`가 `Promise<string>` 대신 sync `string` 반환 — 1인 블로그의 단일 about 페이지에 대한 RSC 모듈 단순화. 미래 ISR 전환 시점에 async로 전환 (autonomy.md "기존 계약 변경" 범위 회피)
- 통합 테스트가 모든 collector를 한 픽스처로 검증 — `getPublicPosts()`가 single source of truth라는 ADR-007 정책의 명시적 보장
- M4-21이 그룹 1~4 services에 적용한 `posts: PostSummary[]` 매개변수 패턴의 격리성 효과를 통합 시점에서 검증 — 각 collector가 외부 상태 의존 없이 입력만으로 결과를 결정하므로 fs mock 한 번으로 7개 함수 모두 검증 가능

### Added — M4-15~19 관련/인접 포스트 PRD 시그니처 정합 + 포스트 상세 통합 (Red→Green→리팩터, 2026-04-25)

**시그니처 교체 (Breaking)** — 사용자 결정에 따라 PRD §7.1 시그니처로 통일:

- `src/features/posts/services/findAdjacentPosts.ts` (신규) — `(posts: PostSummary[], slug: string) => AdjacentPosts`. 순수 함수, fs 모킹 불필요한 단위 테스트 격리성 확보.
- `src/features/posts/services/findRelatedPostsByTags.ts` (신규) — `(posts: PostSummary[], target: PostSummary, limit=3) => RelatedPost[]`. target 객체 전체 의존(`slug`/`tags`/미래 확장 시 `series` 등도 흡수 가능).
- `src/features/posts/services/getAdjacentPosts.ts` 삭제 — 편의형(`getPublicPosts()` 내부 호출)
- `src/features/posts/services/getRelatedPosts.ts` 삭제 — 동일 패턴

**테스트 (14 케이스)**:

- `__tests__/findAdjacentPosts.test.ts` (6 케이스) — prev/next 경계, 첫/마지막 포스트, slug 미일치, 단일/빈 입력
- `__tests__/findRelatedPostsByTags.test.ts` (8 케이스) — overlapScore desc 정렬, target 자기제외, overlap=0 제외, default limit 3·custom limit, target 빈 태그 early return, 동률 입력 순서 보존, 빈 입력

**호출자 통합 (M4-19)**:

- `src/app/posts/[slug]/page.tsx` — `getAdjacentPosts(slug)` → `findAdjacentPosts(allPosts, slug)`, `getRelatedPosts(slug, tags)` → `findRelatedPostsByTags(allPosts, summary)`. `allPosts`를 한 번 계산해 `findAdjacentPosts`/`findRelatedPostsByTags`/`getSeriesDetail` 3 함수가 공유 → React.cache 의존도 감소 + 의도 명확화.

**배럴 갱신**:

- `src/features/posts/services/index.ts` — `find*` 2종 export, `get*` 2종 제거
- `src/features/posts/index.ts` — Public API 동일 정렬
- `src/features/posts/services/getPublicPosts.ts` JSDoc — 새 식별자(`findAdjacentPosts`/`findRelatedPostsByTags`)로 갱신

**3-way 리뷰 결과**:

- Tier 1(Critical): 0건 (3 리뷰어 모두 PASS)
- Tier 2 즉시 수정: `getPublicPosts.ts:9` JSDoc 잔존 식별자 정정 (3 리뷰어 공통 지적)
- Tier 3 후속: `findRelatedPostsByTags`의 `Set` 활용 (포스트 수 백 단위 시점에 도입), 중복 slug 입력 시 `findAdjacentPosts` 동작 명세 추가
- 경계면 검증: PASS (8 producer/consumer 매트릭스 mismatch 0건, 호출자 누락 0)

**검증**: `pnpm test` 209/209 PASS(find\* 14 신규), `pnpm build` 101/101 정적 페이지, `/posts/[slug]` 22+ 라우트 정상 prerender.

**설계 근거**:

- PRD §7.1 시그니처(`(posts, slug)`/`(posts, target, limit)`) 직접 정합 — 단위 테스트에서 fs 모킹 없이 PostSummary[] 배열만 주입 가능 (격리성 향상)
- `target: PostSummary` 객체 전체 의존 — `(slug, tags)` 분해보다 호출자 시그니처 단순, 미래 확장(시간/시리즈 가중치) 시 시그니처 변경 불필요
- 편의형 함수 제거 — API 표면 축소 (PRD 단일 진실 공급원)

### Added — M4-11~14 Popular 스냅샷 (KV + fallback) + 홈 사이드바 실데이터 (Red→Green→통합, 2026-04-25)

**ADR-007 빌드 타임 스냅샷 구현**:

- `src/features/posts/services/getTrendingPosts.ts` (신규) — `(posts: PostSummary[], limit=5) => Promise<{ posts, fallback: boolean }>` 형태로 fallback 신호 노출.
  - 빌드 타임 KV 누적 조회수(`@vercel/kv`의 `mget`) 일괄 페치 후 조회수 desc 정렬, 동률 시 발행일 desc.
  - **2단계 안전망**: (1) `hasKvCredentials()` — `KV_REST_API_URL`/`KV_REST_API_TOKEN` 미설정 시 즉시 fallback. (2) try-catch — KV 호출 실패 시 console.warn + fallback.
  - fallback 경로는 `pickRecentPosts()`로 자체 date desc 재정렬 (호출자 정렬 계약 변경에 견고).
  - `@vercel/kv`는 동적 import — 라이브러리 초기화 실패 격리 (2차 방어선).

**테스트 (8 케이스)**:

- `__tests__/getTrendingPosts.test.ts` — `vi.mock("@vercel/kv")`로 mget mock
  - 조회수 desc 정렬·동률 발행일·null→0 변환·env 미설정 fallback·KV throw fallback·default limit 5·빈 입력·limit 초과

**홈 사이드바 통합 (M4-14)**:

- `src/app/page.tsx` — `HomePage`를 `async function`으로 전환, `await getTrendingPosts(allPosts, 5).posts`로 popularPosts 교체. 임시 `readingTimeMinutes` desc 정렬 제거 (M2 placeholder 정리).
- 사이드바 3블록(`PopularPosts`/`TrendingSeries`/`TrendingTags`)이 모두 실데이터로 동작.
- `dynamic = "force-static"`은 Next.js 16 `cacheComponents` 모드와 충돌 → 미명시. 빌드 결과 SSG로 prerender 확인.

**배럴 갱신**:

- `src/features/posts/services/index.ts` — `getTrendingPosts` export 추가
- `src/features/posts/index.ts` — `getTrendingPosts` + `TrendingSnapshot` type re-export

**3-way 리뷰 결과**:

- Tier 1: 1건 false positive (`getPublicPosts` await 누락 지적 → 실제 `getAllPosts`는 동기 `readdirSync/readFileSync` 함수, `cache(() => ...)` 래퍼도 동기. 빌드/테스트 PASS로 검증)
- Tier 2 즉시 수정: fallback 경로 자체 date desc 정렬, JSDoc 동적 import 의도 정정 (`force-static`은 Next.js 16 cacheComponents 모드 충돌로 미적용)
- Tier 2 보류: `mget<number>` vs `Array<number | null>` 시그니처 — boundary-qa가 기존 형태 PASS 판정. KV 저장값이 항상 number(`route.ts:46`의 `kv.get<number>` + `kv.incr` 보장)이므로 NaN 위험 없음.
- Tier 3: `trending.fallback` UI 표기, 테스트 limit=0 경계, M3-21 description 길이(SEO 별도 트랙)
- 경계면 검증: PASS (8 producer × consumer 매트릭스 mismatch 0건, KV 키 prefix 일관, mget 시그니처 정합)

**검증**: `pnpm test` 195/195 PASS(getTrendingPosts 8 신규), `pnpm build` 101/101 정적 페이지, KV 미설정 환경에서도 빌드 성공 (fallback 경로 동작 확인).

**설계 근거**:

- ADR-007 "빌드 절대 깨뜨리지 않음" 원칙 — env 체크 + try-catch 2중 방어로 KV 장애가 빌드 차단으로 이어지지 않음.
- `Promise<{ posts, fallback }>`로 PRD §7.1 시그니처(`Promise<PostSummary[]>`)를 확장 — ADR-007의 fallback 플래그 요구를 단일 진입점에서 노출. UI에서 "스냅샷 기준 시점" 표기 등 후속 활용 가능.
- 동적 import + `hasKvCredentials()` 병용 — 환경 변수 부재 시 `@vercel/kv` 모듈 자체 평가 회피.

### Added — M4-06~10 시리즈 서비스 분리 + Trending 스냅샷 (Red→Green→라우트 정합성, 2026-04-25)

**시그니처 분리** — PRD §7.3 4종 export 충족 (기존 `getAllSeries`/`getAdjacentInSeries` 유지):

- `src/features/series/services/getSeriesDetail.ts` (신규) — `(posts, slug) => Series | null`. `getAllSeries`로 그룹화 후 slug 매칭, 없으면 `null` (호출자가 `notFound()` 처리).
- `src/features/series/services/getSeriesStats.ts` (신규) — `(series) => SeriesStats`. `{ total, firstPublished, lastUpdated }` 형태로 통계 제공. 빈 시리즈는 `firstPublished/lastUpdated`를 `null`로 반환해 ISO 8601 문자열과 빈 값을 타입으로 구분.
- `src/features/series/services/getTrendingSeries.ts` (신규, ADR-007) — `(posts, limit=3) => Series[]`. 정렬: (1) 소속 public 포스트 수 desc, (2) 동률 시 `lastUpdated` desc. 사전 계산 패턴으로 sort 비교 비용 O(N log N × M) → O(N M + N log N) 감축.

**타입 추가**:

- `src/shared/types/series.ts` — `SeriesStats = { total, firstPublished: string | null, lastUpdated: string | null }`. `null` 사용으로 빈 시리즈와 ISO 8601 문자열 타입 분리.
- `src/shared/types/index.ts` — `SeriesStats` re-export
- `src/features/series/index.ts` — `Series, SeriesStats` 외부 노출

**테스트 (22 케이스)**:

- `__tests__/getAllSeries.test.ts` (6 케이스) — 그룹핑·seriesOrder asc·name/slug 동일·null seriesOrder 무시·빈 입력
- `__tests__/getSeriesDetail.test.ts` (4 케이스) — slug 매칭·null 반환·정렬 보존
- `__tests__/getSeriesStats.test.ts` (6 케이스) — total/first/last·1편·빈 시리즈 null·발행일 비교
- `__tests__/getTrendingSeries.test.ts` (6 케이스) — default limit 3·count desc·동률 lastUpdated desc·series null 무시

**라우트 정합성 (M4-10)**:

- `src/app/page.tsx` — `getAllSeries(allPosts).slice(0, 3)` → `getTrendingSeries(allPosts, TRENDING_SERIES_LIMIT)` (정렬 규칙 ADR-007 적용).
- `src/app/posts/[slug]/page.tsx` — `getAllSeries(allPosts).find(...)` → `getSeriesDetail(allPosts, summary.series)` (단일 시리즈 lookup 단순화).
- `src/app/series/[slug]/page.tsx` — `cache(() => getAllSeries(...))` → `cache((slug) => getSeriesDetail(getPublicPosts(), slug))`. slug별 메모이즈로 의도 명확화. `generateStaticParams`를 `async`로 선언 (Next.js 16 권장).
- `src/app/series/page.tsx` — 변경 없음 (`getAllSeries` 그대로 유지)

**3-way 리뷰 결과**:

- Tier 1(Critical): 1건 false positive (`react-nextjs-reviewer`가 `getPublicPosts` cache 미적용 지적 → 실제로 `getPublicPosts.ts`는 이미 `cache()` wrap됨, 무시).
- Tier 2 즉시 수정: SeriesStats 빈 값을 `null`로(타입 명확성), `getTrendingSeries` 정렬 사전계산 패턴.
- Tier 2 보류: `getSeriesDetail`이 `getAllSeries` 매번 호출 — PRD 시그니처 단순함 우선.
- Tier 3: 테스트 헬퍼 4파일 분기(GC 일괄 정리 권장)
- 경계면 검증: PASS (11 producer × consumer 매트릭스 mismatch 0건)

**검증**: `pnpm test` 187/187 PASS(시리즈 22 신규), `pnpm build` 101/101 정적 페이지, TypeScript strict 통과, `/series/[slug]` 라우트 정상 생성.

**설계 근거**:

- PRD §7.3 4종 export를 의미적으로 분리: `getAllSeries`(전체 그룹핑) / `getSeriesDetail`(단일 lookup) / `getSeriesStats`(통계) / `getTrendingSeries`(트렌딩 정렬). 호출자가 의도를 코드만으로 표현 가능.
- `cache(slug => ...)` 패턴: list 통째 캐시보다 slug 단위 캐시가 메모이즈 의도를 명확히 표현. `getPublicPosts()`가 이미 cache wrap되어 있어 fs 스캔 중복 없음.

### Added — M4-01~05 태그 서비스 분리 + Trending 스냅샷 (Red→Green→라우트 정합성, 2026-04-25)

**시그니처 분리** — PRD §7.2 4종 export 충족:

- `src/features/tags/services/getAllTags.ts` (시그니처 변경) — `(posts) => string[]` (unique 태그 slug, 알파벳 오름차순). 주 용도: `generateStaticParams`. 이전 `TagCount[]` 반환 책임은 `getTagCounts`로 이전.
- `src/features/tags/services/getTagCounts.ts` (신규) — `(posts) => TagCount[]` (count desc, tag asc 정렬). 카운트 집계 단일 책임.
- `src/features/tags/services/getPostsByTag.ts` (신규) — `(posts, tag) => PostSummary[]`. 입력 정렬 보존 단순 filter.
- `src/features/tags/services/getTrendingTags.ts` (신규, ADR-007) — `(posts, limit=10) => TagCount[]`. `getTagCounts(...).slice(0, limit)` 위임으로 트렌딩 의도 명시.

**테스트 (Red→Green, 21 케이스)**:

- `src/features/tags/services/__tests__/getAllTags.test.ts` (4 케이스) — unique·정렬·빈 입력
- `src/features/tags/services/__tests__/getTagCounts.test.ts` (6 케이스) — count desc·동률 알파벳·`tag/slug` 동일·private 호출자 책임
- `src/features/tags/services/__tests__/getPostsByTag.test.ts` (5 케이스) — 필터·순서 보존·대소문자·빈 입력
- `src/features/tags/services/__tests__/getTrendingTags.test.ts` (6 케이스) — default limit 10·동률·private 위임

**라우트 정합성 (M4-05)**:

- `src/app/page.tsx` — `getAllTags(allPosts).slice(0, 10)` → `getTrendingTags(allPosts, TRENDING_TAGS_LIMIT)` (의도 명확화)
- `src/app/posts/page.tsx` — `getAllTags(basePosts)` → `getTagCounts(basePosts)` (TagList props 정합)
- `src/app/tags/page.tsx` — `getAllTags(getPublicPosts())` → `getTagCounts(getPublicPosts())` (count 표시 카드)
- `src/app/tags/[tag]/page.tsx` — `generateStaticParams`를 `async`로 선언(Next.js 16 권장), `getAllTags(...).map((tag) => ({ tag }))` 시그니처 정합. 인라인 `posts.filter(...).includes(decoded)` → `getPostsByTag(getPublicPosts(), decoded)`로 단일 진실 공급원.
- `src/features/tags/index.ts` — services 4종 named export 추가

**3-way 리뷰 결과** (`react-nextjs-code-reviewer` + `boundary-mismatch-qa` + `feature-dev:code-reviewer`):

- Tier 1(Critical): 0건
- Tier 2 즉시 수정 적용: `async generateStaticParams`, 인라인 filter → `getPostsByTag`
- Tier 2 후속(별도): `TagCount.slug` 중복 필드(타입 계약 변경 → M5 SEO 정렬 시점 검토), 테스트 헬퍼 4파일 인라인 중복(GC 일괄 정리 권장)
- 경계면 검증: PASS (4 producer × 4 consumer 매트릭스 mismatch 0건)

**검증**: `pnpm test` 165/165 PASS(태그 21 신규), `pnpm build` 101/101 정적 페이지 (Next.js 16.2.3 Turbopack), TypeScript strict 통과, `/tags/[tag]` 60+개 라우트 정상 생성.

**설계 근거**:

- PRD §7.2가 4종 export를 명시했으므로 `getAllTags`(slug 목록)/`getTagCounts`(카운트 포함)로 의미 분리. 이전 단일 함수가 4 호출자 중 3곳에서 카운트, 1곳에서 slug만 필요했음 → 분리 후 각 호출자가 의도를 코드만으로 표현.
- 모든 services를 `posts: PostSummary[]` 매개변수 형태 순수 함수로 통일 — Law 3 준수, 단위 테스트에서 fs 모킹 불필요.

### Added — M3-17~20 Posts AC characterization + M3-21 빌드 파이프라인 통합 (2026-04-23)

**M3-17/18 PostList Integration (US-001 characterization)**

- `src/features/posts/components/__tests__/PostList.test.tsx` (신규, 6 케이스) — US-001 AC 통합 관점 고정
  - 빈 배열 안내 메시지(role=status), 카드 href `/posts/{slug}`, 제목/설명/reading time/태그 표시, 썸네일 렌더, 페이지 크기(12개) 제한, ViewToggle 리스트/격자 전환 버튼
  - `IntersectionObserver` vi.stubGlobal 스텁(jsdom 미지원 대응)

**M3-19/20 PostDetail Integration (US-002 characterization)**

- `src/features/posts/components/__tests__/PostMetaHeader.test.tsx` (신규, 6 케이스) — 메타 헤더 계약 고정
  - h1 제목 + datetime 속성, 태그 Link `/tags/{tag}` href, 한글 태그 raw slug 유지(항해99 등), 빈 tags → 태그 ul 비렌더, viewCounterSlot·shareSlot 주입 확인

**M3-21 빌드 파이프라인 통합**

- `package.json` — 빌드 스크립트 체인 추가
  - `build:strict` — `STRICT_FRONTMATTER=1 pnpm build` (frontmatter 스키마 위반 시 즉시 throw)
  - `build:vercel` — `vercel-submodule-workaround.sh && pnpm build:strict` (Vercel Build Command용 단일 진입점)
  - 기존 `prebuild` (`copy-content-images.mjs`)은 pnpm 자동 실행 유지
- `src/features/posts/services/getAllPosts.ts` — `STRICT_FRONTMATTER=1` env 감지 시 첫 번째 오류에서 throw (slug + 원본 에러 메시지 포함). 기본 dev 환경은 기존대로 `console.warn` + skip 관용 유지
- **빌드 파이프라인 체인**: `vercel-submodule-workaround.sh` (submodule clone) → `prebuild` (이미지 복사) → `next build` (페이지 생성) — 3단계가 단일 `pnpm build:vercel` 명령으로 실행

**설계 근거**

- M3-17~20은 이미 M2-22~24에서 fixture → 실 서비스 전환이 완료되어 실질적 US-001/002 AC를 만족하는 상태 — 이 커밋의 기여는 **regression 보호 테스트 커버리지 확장**
- `STRICT_FRONTMATTER` 토글 방식은 dev 중 WIP MDX가 빌드를 막지 않도록 하면서 CI/프로덕션에서는 hard-fail을 보장 (autonomy.md 관용 vs 엄격 경계 선택적 해제)

**검증**: `pnpm test` 144/144 통과(PostList 6/6 + PostMetaHeader 6/6 신규), `pnpm lint` 0 에러, `STRICT_FRONTMATTER=1 pnpm build` 101 페이지 정적 생성 성공

### Added — M3-15~16 MOD-lightbox Radix 기반 multi-image carousel (Green, 2026-04-23)

- `src/features/lightbox/contexts/LightboxContext.ts` — Context 확장
  - 기존 `{ open(single), close }` → `{ open(single), openMany(images, startIndex?), close }`로 확장
  - `LightboxImage = { src, alt }` 공개 타입 추가
- `src/features/lightbox/components/LightboxProvider.tsx` — 상태 모델을 `{ images: readonly LightboxImage[], index }`로 전환
  - `images.length === 0`이면 닫힘 상태로 간주, `images.length > 0`이면 자동 `ImageLightbox` 마운트
  - `goNext`/`goPrev` — modulo 산술로 circular navigation (마지막→첫, 첫→마지막)
  - `startIndex` 경계 검사 (`Math.max(0, Math.min(n-1))`) + empty images 가드
- `src/features/lightbox/components/ImageLightbox.tsx` — props 변경 `{ src, alt, onClose }` → `{ images, index, onNext, onPrev, onClose }`
  - `hasMultiple = images.length > 1`일 때만 좌우 화살표 (`ChevronLeft`/`ChevronRight`) 렌더 — 1장 시 화살표 자동 숨김
  - `document.addEventListener("keydown")` ArrowRight/ArrowLeft 키보드 nav (hasMultiple일 때만 등록, useEffect cleanup로 누수 방지)
  - Radix Dialog primitive 유지 — 포커스 트랩·ESC·포커스 복원·body scroll lock·fade 300ms 변화없음
- `src/features/lightbox/components/__tests__/ImageLightbox.test.tsx` (신규, 9 케이스)
  - 단일 이미지 → 화살표 숨김, 다중 이미지 → 화살표 렌더, next/prev 버튼 nav, circular navigation(마지막→첫, 첫→마지막), ArrowRight/ArrowLeft 키보드 nav, ESC 닫기
- `src/features/lightbox/index.ts` — `LightboxImage` 타입 공개 API 추가, JSDoc M3-16 Green 상태 반영
- `src/app/providers.tsx` — `LightboxProvider` 트리 루트 배치. `ThemeProvider > MotionConfig > LightboxProvider > children` 순서로 `useLightbox()` 소비자 전역 접근 가능
- **의존성 없이 구현**: ROADMAP이 지목한 `yet-another-react-lightbox` 설치가 autonomy.md에 의해 블록되어, Radix Dialog primitive + custom carousel 로직으로 동등 기능 제공. API 계약은 독립적이라 향후 스왑 시 내부 구현만 교체
- **follow-up**: MdxImage 클릭 → `useLightbox().openMany()` 연결은 M3-20 Posts AC 완성 스코프에서 처리 (MDX 이미지 수집/그룹화 로직 포함)
- **검증**: `pnpm test` 132/132 통과(ImageLightbox 9/9), `pnpm lint` 0 에러

### Added — M3-13~14 MOD-theme useTheme wrapper + View Transitions persistence (Green, 2026-04-23)

- `src/features/theme/hooks/useTheme.ts` (신규) — next-themes wrapper 훅 (ADR-011)
  - `{ resolvedTheme: "light"|"dark"|null, toggleTheme, setTheme, mounted }` 반환
  - `useSyncExternalStore` 기반 `mounted` 플래그 — hydration 이전 `resolvedTheme: null` 반환으로 FOUC 차단
  - `toggleTheme` — light↔dark 스왑 원샷 호출
  - `document.startViewTransition` progressive enhancement — 지원 시 전환 경유, 미지원 시 즉시 apply
- `src/features/theme/hooks/index.ts` (신규) — `useTheme` re-export leaf barrel
- `src/features/theme/components/ThemeSwitcher.tsx` — 프레젠테이션 전용으로 축소. next-themes 직접 소비 로직은 `useTheme` 훅으로 이관
- `src/features/theme/index.ts` — `useTheme` public API 추가
- `src/features/theme/components/__tests__/ThemeSwitcher.test.tsx` (신규, 6 케이스, M3-13) — Integration characterization 테스트
  - aria-label 존재, light→dark 클릭 토글(aria-pressed + html.dark 클래스), dark→light 복귀, View Transitions API 지원 시 `startViewTransition` 경유, 미지원 환경에서도 전환 동작, localStorage 저장
  - `matchMedia` mock + ThemeProvider 래퍼로 next-themes 계약 테스트
- **설계 근거**: 기존 ThemeSwitcher가 이미 계약을 만족하는 상태였지만, CommentsSection 등 다른 feature가 공유할 wrapper 훅을 노출해야 재사용 가능. follow-up: CommentsSection을 `features/theme`의 wrapper로 전환해 mounted 감지 기반 postMessage 타이밍 개선
- **검증**: `pnpm test` 123/123 통과(ThemeSwitcher 6/6), `pnpm lint` 0 에러

### Added — M3-11~12 MOD-comments Giscus 댓글 통합 완성 (Green, 2026-04-23)

- `src/features/comments/components/CommentsSection.tsx` — placeholder → Giscus 실 iframe 주입
  - `isPrivate?: boolean` prop 신규 — `true`면 섹션 자체 비렌더(개인 포스트 노출 방지, US-005 AC)
  - 환경변수 4종(`NEXT_PUBLIC_GISCUS_REPO`·`REPO_ID`·`CATEGORY`·`CATEGORY_ID`) 누락 시 설정 안내 placeholder
  - IntersectionObserver lazy-mount(`rootMargin: "200px"`) → `giscus.app/client.js` script 주입
  - `next-themes` `useTheme` 연동 — 최초 주입 시 현재 테마 주입, 이후 테마 변경은 iframe `postMessage({ giscus: { setConfig: { theme } } })` 전파로 재주입 회피
  - 언마운트 시 script·iframe 정리 (메모리 누수 방지)
  - **DIY 로더 근거**: `@giscus/react` 미설치(autonomy.md deps 블록) 상태에서 공식 `client.js` + `data-*` attrs 계약을 직접 준수한 경량 wrapper. `data-mapping: specific`·`data-term: slug`·`data-strict: 1` 등 권장 설정 적용. `@giscus/react` 스왑은 follow-up이며 외부 계약 identical이라 UI 영향 없음
- `src/features/comments/components/__tests__/CommentsSection.test.tsx` (신규, 5 케이스) — Integration 테스트
  - `isPrivate=true` 비렌더, 환경변수 누락 안내 placeholder, script 주입 + data-\* attrs 검증(repo/repoId/category/categoryId/term/mapping/crossOrigin/async), slug별 data-term 분기, 언마운트 cleanup
  - `IntersectionObserver` vi.stubGlobal로 즉시 교차 발동, `vi.stubEnv`로 환경변수 주입
- `src/app/posts/[slug]/page.tsx` — `<CommentsSection>`에 `isPrivate={summary.private}` 전달 (private 포스트가 includePrivate 경로로 들어올 때 댓글 차단)
- `src/features/comments/index.ts` — JSDoc 갱신: M3-12 Green 완료 + DIY 로더 근거 명시
- **검증**: `pnpm test` 117/117 통과(CommentsSection 5/5 Red→Green), `pnpm lint` 0 에러(테마 deps는 postMessage 동기화 이유로 명시적 `eslint-disable` + 주석), `pnpm build` 통과

### Added — M3-08~10 MOD-views KV 조회수 통합 완성 (Green, 2026-04-23)

- `src/app/api/views/route.ts` — placeholder → PRD §7.5 계약 정합 구현
  - GET: `{ views: number }` shape + `Cache-Control: no-store` + 400 on invalid slug
  - POST: `204 no content` + `no-store` + 400 on invalid slug/malformed JSON
  - 저장소: `globalThis.__devBlogViewsStore` Map (HMR 생존). **프로덕션 배포 전 `@vercel/kv` incr/mget 어댑터로 스왑 필수** (ADR-003, follow-up). autonomy.md에 의해 deps 자율 설치 불가, 계약 shape는 현재 구현과 KV 어댑터 간 identical이라 UI·테스트 영향 없음
- `src/features/views/services/kv-client.ts` — `fetchPostViewsOrNull(slug): Promise<number | null>` 신규. UI가 "— 회" fallback을 렌더해야 할 때 사용(실패/성공 구분). 기존 `getPostViews`는 이 저수준 함수를 감싸 `0` fallback(배치·SSR용)을 유지 — **tolerant consumer** 계약 보존
- `src/features/views/hooks/useViews.ts` (신규) — 마운트 시 POST +1 → GET 파이프라인, `sessionStorage` 기반 slug별 dedup. `{ views: number | null, failed: boolean }` 반환. React 19 룰(`set-state-in-effect`·`refs`) 양립 위해 slug 생명주기 내 불변 가정 + `[slug]` deps effect 단일 실행 패턴 채택 (슬러그 변경은 App Router 세그먼트 remount로 처리)
- `src/features/views/hooks/index.ts` (신규) — `useViews` re-export leaf barrel
- `src/features/views/components/ViewCounter.tsx` — server component placeholder → `"use client"` + `useViews(slug)` 연결. 3-state 렌더(로딩 스켈레톤 `animate-pulse` / 성공 `toLocaleString("ko-KR")회` / 실패 `— 회`) + `aria-label` 상태별 분기(`조회수 불러오는 중` / `조회수 N회` / `조회수 정보 없음`)
- `src/features/views/index.ts` — public API에 `useViews`·`fetchPostViewsOrNull` 추가
- `src/features/views/components/__tests__/ViewCounter.test.tsx` (신규, 7 케이스) — Integration 테스트
  - 초기 로딩 placeholder, POST +1 + GET 수신 후 숫자 렌더(seeded 42 → 43), 3자리 이상 `toLocaleString("ko-KR")` 포맷(1234 → "1,234회"), 동일 slug 재마운트 시 POST 재호출 금지(sessionStorage dedup), 서로 다른 slug별 개별 POST, GET 500 → `— 회` fallback + `조회수 정보 없음` aria-label, POST 실패도 GET 결과 표시(best-effort)
- **설계 근거**: React 19 `react-hooks/set-state-in-effect` + `react-hooks/refs` 동시 충족 위해 `useRef` 기반 setState-during-render 패턴 대신 **"slug는 컴포넌트 lifecycle 내 불변"** 가정으로 단순화. App Router의 `/posts/[slug]` 세그먼트가 slug param 변경 시 언마운트/재마운트하는 Next.js 계약에 편승
- **검증**: `pnpm test` 112/112 통과(M3-09 Red 7/7 포함), `pnpm lint` 0 에러, `pnpm build` 101페이지 정적 생성

### Added — M3-07 RT-/api/views Route Handler 계약 테스트 (Red, 2026-04-22)

- `src/app/api/views/__tests__/route.test.ts` (신규, 16 케이스) — Route Handler 함수(`GET`, `POST`)를 직접 호출하는 **서버 단위 테스트**. `kv-client.test.ts`(MSW 기반 컨슈머)와 달리 **프로듀서 관점에서 PRD §7.5 + ROADMAP M3-08 계약을 직접 강제**
  - GET 8 cases: `{ views: number }` shape + slug 필드 누설 금지 + `Cache-Control: no-store` + `Content-Type: application/json` + 400 cases(null·empty·공백·대문자)
  - POST 8 cases: **204 no body** + `Cache-Control: no-store` + 400 cases(slug 누락·공백·malformed JSON·string primitive·null JSON)
- **Red 검증**: 5건 실패(모두 계약 위반으로 올바르게 실패)
  - GET: `slug` 필드 누설(현재 `{ slug, views: 0 }`) / `no-store` 헤더 미설정
  - POST: 200 응답(204여야 함) / `{ slug, views: 1 }` body 누설 / `no-store` 헤더 미설정
  - M3-08 Green에서 route.ts를 `Response.json({ views }, { headers: { "cache-control": "no-store" } })` + `new Response(null, { status: 204, headers: { "cache-control": "no-store" } })` + `@vercel/kv` incr/get으로 수정하면 자연 녹색 전환
- **드리프트 방어 설계**: `route.test.ts`가 **프로듀서↔MSW mock 드리프트의 유일한 게이트**. `handlers.ts`(컨슈머 테스트용 mock)가 PRD 스펙을 복제하고 있으므로, 한쪽만 수정되어 드리프트가 날 위험을 route.test.ts의 exact-shape 단언(`Object.keys(body).sort() === ["views"]`)이 차단
- **리뷰 결과 요약 (3-way 병렬: react-nextjs-code-reviewer + boundary-mismatch-qa + oh-my-claudecode:code-reviewer)**:
  - Tier 1 수정(2건, 3명 전원 독립 지적): (a) `as unknown as Parameters<typeof GET>[0]` 이중 캐스팅 → `new NextRequest(url)` 직접 생성으로 교체(M3-08에서 `req.nextUrl`/`req.cookies` 사용 시 silent 실패 방지), (b) `buildPostRequest`의 `"not-json"` sentinel 리터럴 파라미터 → discriminated union `{ type: "json" | "malformed" }`로 교체(의도 명시)
  - Tier 2 수정(3건): POST 400 케이스들의 실제 전송 body 명확화(`JSON.stringify(null)` = `"null"`이 유효 JSON literal임을 주석 + 케이스명으로 노출), GET `Content-Type: application/json` 응답 헤더 검증 추가, POST `Cache-Control: no-store` 검증 추가(ROADMAP "GET/POST 핸들러" 문자적 해석)
  - Tier 3 기록(후속): (a) `features/views/schemas/` 아래 Zod `ViewsResponseSchema.strict()` + `ViewsPostBodySchema.strict()` 승격 — route.ts·handlers.ts·kv-client.ts가 모두 parse로 소비하는 단일 진실 공급원 체제 (M3-08 진입 시 고려), (b) `kv-client.ts`의 `isViewsResponse` 가드를 exact-shape로 강화(현재는 extra field 허용 — tolerant consumer 설계라 의도적, CHANGELOG에 책임 경계 명시), (c) GET happy path 3회 반복 호출 DRY — Red 진단성 우선 유지
  - 의견 충돌 해결: boundary 단독의 "POST `no-store` 필요" 주장 채택(ROADMAP 문구 문자적 해석), boundary 단독의 "POST no-store 불필요(PRD GET only)" 미주장 → 전자 우선
- **검증**: route.test.ts 5 fail / 100 pass(의도된 Red), 전체 suite 10 file pass + 1 file fail(route.test.ts). `tsc --noEmit` + ESLint 통과

### Added — M3-05~06 KV 조회수 클라이언트 + MSW 테스트 인프라 (2026-04-21)

- `package.json` — `msw@^2` devDependencies 추가 (Mock Service Worker v2.13.2). PRD §7.5 `RT-/api/views` 계약을 테스트 더블로 재현하기 위함
- `src/shared/test/msw/handlers.ts` (신규) — `/api/views` GET/POST 핸들러 + `seedMockView(slug, count)`/`resetMockViews()` 테스트 헬퍼. **PRD §7.5 계약의 machine-readable reference**로 격상: `GET → { views: number }`, `POST → 204 (no body)`, 잘못된 slug → 400. slug 검증은 `@/shared/utils/slug` 의 `validateSlug`를 재사용해 서버 구현과 drift 차단
- `src/shared/test/msw/server.ts` (신규) — `setupServer(...handlers)` Node 전용 export (브라우저 worker 미사용)
- `src/shared/test/setup.ts` — MSW lifecycle hooks 추가 (`beforeAll(listen, { onUnhandledRequest: "error" })`, `afterEach(cleanup + resetHandlers + resetMockViews)`, `afterAll(close)`). `"error"` 정책으로 핸들러 누락 요청을 즉시 실패시켜 integration 신뢰도 확보
- `src/features/views/services/kv-client.ts` (신규) — PRD §7.5 MOD-views public API 3종
  - `getPostViews(slug): Promise<number>` — `fetch(/api/views?slug=...)` `cache: "no-store"`, `isViewsResponse` 타입 가드로 malformed payload 방어, KV 실패 시 조용히 0 + `console.warn`
  - `incrementPostViews(slug): Promise<void>` — POST 호출, body 미파싱(204 호환), 실패 시 throw 대신 `console.warn`으로 UI 블록 방지
  - `getBatchPostViews(slugs: ReadonlyArray<string>)` — `Promise.all` 병렬 fanout, `new Set(slugs)`로 dedup, 개별 실패는 `getPostViews`의 fallback에 위임 (JSDoc으로 순서 비보장 명시)
- `src/features/views/services/__tests__/kv-client.test.ts` (신규) — 14개 테스트: happy path(중복 slug·빈 배열 포함), 500/네트워크/malformed shape/잘못된 slug fallback, POST 증분·최초 호출·무시 경로. 성공 경로마다 `expect(console.warn).not.toHaveBeenCalled()` 단언으로 노이즈 감지
- `src/features/views/services/index.ts` (신규) — re-export 전용 barrel (`.claude/rules/typescript.md` §배럴 규칙 준수)
- `src/features/views/index.ts` — public API에 `getPostViews`, `incrementPostViews`, `getBatchPostViews` 추가. 기존 `ViewCounter` export 유지
- **설계 근거**: kv-client는 **tolerant consumer** — 현재 placeholder route(`{ slug, views }`)와 PRD 계약(`{ views }`) 모두 `views: number` 필드만 추출하므로 forward-compatible. M3-07~08에서 Route Handler를 PRD shape로 수정해도 kv-client 수정 불필요
- **리뷰 결과 요약 (3-way 병렬: react-nextjs-code-reviewer + boundary-mismatch-qa + oh-my-claudecode:code-reviewer)**:
  - Tier 1 수정(2건, 2개 이상 리뷰어 독립 지적): (a) `handlers.ts`의 자체 `SLUG_PATTERN`/`isValidSlug` 중복 구현 제거 → `validateSlug` 재사용으로 drift 봉쇄, (b) `kv-client.test.ts`의 `resetMockViews()` 이중 호출 제거 (setup.ts afterEach에 단일 진실 공급원 일원화)
  - Tier 2 수정(4건): 리턴 타입 자동 추론 전환(`typescript.md` §9 준수), POST `cache: "no-store"` 노이즈 제거, 성공 경로 테스트에 `warn.not.toHaveBeenCalled()` 단언 추가, `getBatchPostViews` JSDoc + `handlers.ts` 계약 reference 주석 강화
  - Tier 3 기록(후속): PRD drift 감지용 contract test suite 추가(M3-07 진입 전 검토), placeholder POST `views:1` → 204 수정(M3-07~08 범위), `react-nextjs`가 제안한 `'use client'` directive는 **프로젝트 `components.md:12`("hooks/browser API 사용 시에만") 기준 미적용** — 서비스 파일 관례에 반함
  - 의견 충돌 해결: `'use client'` 추가(triangulation 결과 다수/규칙 모두 반대 → 스킵), 리턴 타입 명시(규칙 엄격 준수 → 제거)
- **검증**: `pnpm test` 89/89 통과, `pnpm build` Next.js 16 정적 경로 생성 성공

### Added — M3-01~04 검색 기능 Fuse.js 연결 + 컴포넌트 분리 (2026-04-21)

- `package.json` — `fuse.js@^7` 추가, devDependencies에 `@testing-library/react@^16`, `@testing-library/user-event@^14`, `@testing-library/jest-dom@^6`, `jsdom@^27` 추가
- `vitest.config.ts` — `environment: "node"` → `"jsdom"` 전환, `setupFiles: ["./src/shared/test/setup.ts"]` 추가
- `src/shared/test/setup.ts` (신규) — `@testing-library/jest-dom/vitest` matcher 확장 + `afterEach(cleanup)` 등록
- `src/features/posts/services/__tests__/getAllPosts.test.ts`, `getPostDetail.test.ts` — `/** @vitest-environment node */` pragma 추가 (fs mocking 테스트용)
- `src/features/posts/utils/__tests__/extractTocFromMarkdown.test.ts` — M2-09 개정 반영: "h1 제외" → "h1 포함" 테스트 수정 (CustomMDX +1 시프트 렌더링 전제)
- `src/features/search/types/index.ts` (신규) — `SearchResult` 타입(`post` + `score` + `matches?: ReadonlyArray<FuseResultMatch>`) 정의
- `src/features/search/hooks/useSearch.ts` (신규) — Fuse.js 기반 fuzzy 검색 훅. PRD §7.4 계약: weights(title 0.5 / description 0.3 / tags 0.2), threshold 0.4, limit 10, debounce 200ms, `ignoreLocation: true`, `minMatchCharLength: 2`, `includeScore/Matches`. 빈 문자열 즉시 반영 UX. 이벤트 핸들러 내부 setTimeout debounce 패턴으로 `react-hooks/set-state-in-effect` + `react-hooks/refs` 룰 회피
- `src/features/search/hooks/__tests__/useSearch.test.tsx` (신규) — 11개 테스트: 초기 상태, 200ms debounce, limit 기본/커스텀, title weight 우선순위, tag 매치, fuzzy(오타) 허용, score 정렬, debounce cancellation, 빈 문자열 즉시 리셋
- `src/features/search/components/SearchButton.tsx` (신규) — 아이콘 트리거 버튼. `size-11`(44px) 터치 타겟, `aria-keyshortcuts="Meta+k Control+k"`, `motion-reduce:transition-none`
- `src/features/search/components/SearchModal.tsx` (신규) — Radix Dialog 기반 검색 모달. `useSearch` 훅 연동, ArrowDown/ArrowUp 키보드 내비(리스트 순환, ArrowUp input 예외), AnimatePresence + stagger, debounce 대기 중 "검색 중..." `aria-live="polite"` 안내, `query.trim() === ""` 기준 풋터 분기(결과/입력 상태 깜빡임 방지)
- `src/features/search/components/SearchResultItem.tsx` (신규) — Fuse match indices를 `<mark>`로 하이라이트. 중첩/인접 구간은 `effectiveStart = Math.max(start, cursor)` 패턴으로 병합 (텍스트 소실 버그 방지)
- `src/features/search/components/SearchTrigger.tsx` — 기존 통합체를 `SearchButton + SearchModal + useSearchShortcut` 얇은 조립체로 리팩터. `{ posts: PostSummary[] }` Public API 보존으로 `layout.tsx` 호출자 영향 없음
- `src/features/search/components/__tests__/SearchModal.test.tsx` (신규) — 9개 테스트: open 토글, autoFocus, 빈 상태/총 포스트 수 안내, debounce → 결과 렌더, 결과 없음, href 정확성, onOpenChange 전파, ESC 닫기, ArrowDown 포커스 이동
- `src/features/search/components/index.ts`, `src/features/search/index.ts` — `SearchButton`, `SearchModal`, `SearchResultItem`, `SearchTrigger`, `useSearch`, type `SearchResult` public API 노출 (PRD §7.4)
- **리뷰 결과 요약 (REVIEW 1-way: react-nextjs-code-reviewer, a11y/boundary는 토큰 한도로 생략·self-check 대체)**:
  - Tier 1 수정: `SearchResultItem.renderHighlighted`의 중첩 구간 텍스트 소실 버그, `useSearch`의 Effect 내부 setState 룰 위반 → 이벤트 핸들러 debounce 패턴 전환
  - Tier 2 수정: `trimmed` 기준을 `debouncedQuery`로 통일해 공백 입력 시 "결과 없음" 깜빡임 해소, ArrowUp input 예외 추가, useMemo 2개 근거 주석 명시
- **검증**: `pnpm test` 75/75 통과, `pnpm lint` 0 에러, `pnpm build` 101페이지 정적 생성 성공

### Added — PostTocAside 데스크탑 TOC 토글 컴포넌트 + Toc.tsx hydration 패턴 개선 (2026-04-16)

- `src/features/posts/components/PostTocAside.tsx` (신규) — 데스크탑 TOC 열기/닫기 토글 래퍼. `isOpen=true` 시 `lg:w-64 + X 닫기 버튼 + Toc nav`, `isOpen=false` 시 `lg:w-0 + ChevronLeft 원형 버튼`만 표시. `overflow-visible`로 0px aside에서 버튼이 자연스럽게 넘쳐 보임. nav DOM 제거 방식으로 width 축소 시 텍스트 리플로우 방지.
- `src/features/posts/components/Toc.tsx` — Portal guard를 `setMounted + useEffect` → `useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)` 패턴으로 교체. react.md `set-state-in-effect` lint 위반 해소. `max-h-[80vh]` → `max-h-mobile-sheet` (globals.css @utility 토큰) 교체.
- `src/features/posts/components/index.ts` — `PostTocAside` export 추가
- `src/features/posts/index.ts` — `PostTocAside` public API 배럴 export 추가
- `src/app/posts/[slug]/page.tsx` — 인라인 `<aside><Toc>` 조립 → `<PostTocAside items={detail.toc} />` 단일 컴포넌트로 교체
- `src/shared/styles/globals.css` — `@utility max-h-mobile-sheet { max-height: 80vh }` 토큰 추가 (GC 자동 수정: `max-h-[80vh]` arbitrary value 제거)
- **빌드**: `pnpm build` 101페이지 통과

### Fixed — MDX bold 렌더링 및 부가 버그 수정 (2026-04-16)

- `features/posts/services/getPostDetail.ts` — `preprocessMdxContent` 추가: CommonMark flanking delimiter 규칙으로 `**text()**한글` 패턴이 리터럴 `**`로 출력되던 문제 수정. `**...**` → `<strong>...</strong>` HTML 변환을 MDX 파싱 전에 수행 (기존 앱 `parser.ts` 동일 방식)
- `shared/styles/prose.css` — `.prose h1` 스타일 추가: 포스트 본문에서 `#` heading이 사용되는 경우 스타일 미적용 수정
- `shared/components/mdx/MdxImage.tsx` — `w-full` → `max-w-full`: 작은 이미지가 100% 너비로 강제 확장되어 화질 저하 발생하던 문제 수정
- `features/posts/components/ScrollToTop.tsx` — `aria-hidden + tabIndex=-1` → `inert={true}`: React 19 `inert=""` 빈 문자열 boolean 경고 및 숨겨진 버튼에 포커스 진입 가능한 접근성 문제 수정
- `features/posts/utils/extractTocFromMarkdown.ts` — `seenIds` Map 도입: rehype-slug와 동일한 `-1`, `-2` suffix 중복 해소로 TOC React key 중복 경고 수정

### Fixed — Playwright E2E 검증 중 발견된 버그 (2026-04-16)

- `app/tags/[tag]/page.tsx` — `normalizeSlug` 제거: SLUG_PATTERN(`/^[a-z0-9-]+$/`)이 대문자·한글 태그를 거부해 `/tags/React`, `/tags/항해99` 등 전부 404 반환하던 문제 수정. `decodeURIComponent(tag)` 직접 사용으로 `getAllTags`의 raw slug와 일치
- `app/not-found.tsx` — metadata.title에서 `| chan9yu` 수동 suffix 제거: `layout.tsx`의 title template `"%s | chan9yu"` 와 중복 적용되어 "페이지를 찾을 수 없습니다 | chan9yu | chan9yu" 표시되던 이중 suffix 수정
- **빌드**: `pnpm build` exit 0, 101개 페이지 정적 생성 (58개+ 한글 태그 URL 포함)

### Fixed — 리뷰 기반 품질 개선 배치 (2026-04-16)

- `posts/[slug]/page.tsx` — `detail === null` 시 fallback UI 제거, `notFound()` 가드 추가; `detail?.toc ?? []` → `detail.toc` (null 단언 불필요)
- `CustomMDX.tsx` — `MdxP` 컴포넌트 추가: MDX `<p><figure>` 무효 중첩 → 하이드레이션 에러 수정 (standalone 이미지 래퍼 생략)
- `shared/libs/shiki.ts` — WASM 초기화 실패 시 `highlighterPromise = null` 재설정으로 재시도 가능하도록 수정
- `features/series/services/getAllSeries.ts` — `SeriesPost` 타입 가드 도입; `name = seriesId` (raw 값 보존, slugify 제거)
- `app/series/[slug]/page.tsx` — 한글·특수문자 시리즈 slug `normalizeSlug` 제거 → `decodeURIComponent` + 직접 lookup; `React.cache` 적용으로 `getSeriesList()` 렌더당 1회 계산 보장; 중복 `BookOpen` + "시리즈" span 제거
- `app/page.tsx` — `metadata` export 추가 (title · description · canonical)
- **빌드**: 101페이지 통과, `/series/항해 플러스 프론트엔드 6기` 등 한글 시리즈 URL 정상 생성 확인

### Changed — M2-22~24 fixture 완전 제거, 실데이터 마이그레이션 (2026-04-16)

- `getPublicPosts` · `getPostBySlug` — `postsFixture` 제거, `getAllPosts()` 실 fs 파싱으로 교체 (M2-23)
- `getAllSeries` · `getAllTags` — `PostSummary[]` 파라미터 방식 신규 서비스 (Law 3 준수) (M2-23)
- `app/page.tsx` · `app/posts/page.tsx` · `app/posts/[slug]/page.tsx` — fixture → 실 서비스 호출 전환 (M2-23)
- `app/series/page.tsx` · `app/series/[slug]/page.tsx` — `seriesFixture` 완전 제거, `getAllSeries(getPublicPosts())` 적용 (M2-24)
- `app/tags/page.tsx` · `app/tags/[tag]/page.tsx` — `tagsFixture` 완전 제거, `getAllTags(getPublicPosts())` 적용 (M2-24)
- `src/` 전체 fixture import 0건 확인, 빌드 101페이지 생성 통과 (24개 포스트, 58개+ 태그 실데이터)

### Added — M2-03~11 파싱 파이프라인 TDD 완성 (2026-04-15)

**의존성**

- `gray-matter 4.0.3` (prod) — MDX frontmatter 파싱
- `zod 4.3.6` (prod) — PostFrontmatterSchema 런타임 검증
- `vitest 4.1.4` + `@vitest/coverage-v8` (dev) — TDD 테스트 러너

**신규 파일**

- `vitest.config.ts` — `@` 경로 alias 포함, node 환경, v8 커버리지
- `src/features/posts/schemas/frontmatter.ts` — `PostFrontmatterSchema` (M2-05): series·seriesOrder 쌍 refine 포함
- `src/features/posts/utils/parseFrontmatter.ts` — `--`→`---` 보정 + gray-matter + Zod + slug 검증 (M2-04)
- `src/features/posts/utils/calculateReadingTime.ts` — 코드·수식·이미지 제외, 한국어 500자/분, ceil, 최소 1분 (M2-07)
- `src/features/posts/utils/extractTocFromMarkdown.ts` — h2/h3 추출, 코드 블록 제외, id=slugify(text) (M2-09)
- `src/shared/utils/slugify.ts` — 한글 보존, 특수문자 제거, 공백→하이픈 (M2-11)
- `src/features/posts/utils/__tests__/parseFrontmatter.test.ts` — 7케이스 (M2-03 Red)
- `src/features/posts/utils/__tests__/calculateReadingTime.test.ts` — 9케이스 (M2-06 Red)
- `src/features/posts/utils/__tests__/extractTocFromMarkdown.test.ts` — 9케이스 (M2-08 Red)
- `src/shared/utils/__tests__/slugify.test.ts` — 10케이스 (M2-10 Red)

**테스트**: 4 파일 · 36 케이스 전부 통과

### Added — M2-02 Vercel Submodule Workaround 스크립트 (2026-04-15)

- `scripts/vercel-submodule-workaround.sh` 신규 작성
- SSH / HTTPS URL 모두 지원: `.gitmodules` 파싱 → `git config`로 토큰 URL 주입 → `git submodule sync && update`
- `GITHUB_REPO_CLONE_TOKEN` 미설정 시 exit 1로 빌드 중단
- `.gitmodules` 파일 자체를 수정하지 않으므로 git 커밋 오염 없음

### Added — M2-01 contents/ Git Submodule 구성 (2026-04-15)

- `.gitmodules`: `chan9yu/dev-blog-archive` private 레포를 `contents/` 경로로 서브모듈 등록
- branch: `main` 고정 추적
- 검증: `git submodule update --init --recursive` 성공, `contents/posts/` · `contents/about/` 구조 확인

### Added — framer-motion 애니메이션 시스템 도입 (2026-04-15)

**의존성**

- `framer-motion` (prod, 신규) — `AnimatePresence`, `motion.*`, `useInView`, `MotionConfig`

**신규 파일**

- `src/shared/hooks/useRafCallback.ts` — rAF throttle 훅. stale closure 없이 항상 최신 콜백 호출, unmount 시 자동 취소.

**수정 파일**

- `src/app/providers.tsx` — `MotionConfig` 추가. `reducedMotion="user"` (시스템 prefers-reduced-motion 자동 존중, WCAG 2.3.3), 전역 `transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }`.
- `src/shared/components/common/FadeInWhenVisible.tsx` — CSS transition → framer-motion `useInView` + rAF 지연 `setShouldAnimate` 전환. FOUC 없는 fade + slide-up.
- `src/shared/components/common/PageTransition.tsx` — CSS `animate-in` → framer-motion `motion.div`. `key={pathname}` remount + rAF `setMounted` 패턴. `set-state-in-effect` 룰 준수 (`deps=[]`).
- `src/features/posts/components/PostList.tsx` — `AnimatePresence mode="popLayout"` + `motion.div` + `cardVariants` (staggerChildren 0.05). IntersectionObserver 콜백에 rAF 적용.
- `src/features/search/components/SearchTrigger.tsx` — 검색 결과 목록에 `AnimatePresence mode="wait"` + `motion.ul`/`motion.li` stagger (0.04s). 검색어 변경 시 전체 목록 재mount.

**타입 수정**

- `ease: [0.4, 0, 0.2, 1] as [number, number, number, number]` — framer-motion Bezier 4-tuple 타입 정합 (`number[]` 대신 tuple).

**ESLint**

- `PageTransition` effect 내 `setMounted(false)` 제거 → `set-state-in-effect` 위반 해소. `key={pathname}` remount 시 state 자동 리셋으로 충분.

### Review Cycle — 4-way 코드 리뷰 + Tier 1/2 수정 (2026-04-15)

**리뷰 실행**

- `react-nextjs-code-reviewer` · `a11y-auditor` · `feature-dev:code-reviewer` · `codex` 4-way 병렬 감사.
- 대상: `src/**/*.tsx` 60개 파일 전수.
- 기준: `.claude/rules/*` 15종 + `frontend-design` · `nextjs-best-practices` · `vercel-react-best-practices` · `frontend-fundamentals` 스킬.
- 통합 Tier 1 10건 · Tier 2 다수 식별 → 우선순위 수정 → `compound-reviewer` 1차 PASS → 추가 Tier 2 2건 반영.

**수정 적용 (Tier 1 10건 + Tier 2 2건)**

- `src/features/posts/services/{getPublicPosts,getAdjacentPosts,getRelatedPosts,index}.ts` 신규 — 공개 포스트 SSOT 단일화(Tier 1 #10). `features/posts/index.ts`에서 services re-export.
- `src/app/layout.tsx` · `src/app/page.tsx` · `src/app/posts/page.tsx` · `src/app/tags/[tag]/page.tsx` — inline `postsFixture.filter(...)`를 `getPublicPosts()` 호출로 치환. "공개 포스트 정의" 단일 진실 공급원 확립.
- `src/app/posts/[slug]/page.tsx` — inline `findAdjacent` / `findRelated` 제거 → `getAdjacentPosts(slug)` · `getRelatedPosts(slug, tags)` 서비스 호출.
- `src/app/posts/page.tsx` — 사이드바 `aria-label="태그 필터"` + `w-56` canonical 클래스 적용(arbitrary value 회피, `styling.md` 회고 준수).
- `src/features/posts/components/ReadingProgress.tsx` — `<progress>` 의미론 강화 `aria-valuemin`/`aria-valuemax`, arbitrary `blur-[10px]` → canonical `blur-md`.
- `src/features/posts/components/ScrollToTop.tsx` — 숨김 상태에서 `tabIndex={-1}`로 포커스 트랩 차단 (WCAG 2.4.3).
- `src/features/posts/components/ShareButtons.tsx` — `setTimeout`을 `useEffect` cleanup 루프로 격리(`workflow.md` "임시 타이머 우회 금지" 준수).
- `src/features/posts/components/Toc.tsx` — 인라인 `onClick`/`style` 제거, TOC 레벨을 class map으로, 활성 항목에 `aria-current="location"`.
- `src/features/search/components/SearchTrigger.tsx` — `role` 오용 제거, `useMemo`로 필터 결과 안정화, 이벤트 핸들러 named 함수로 추출(`react.md` 인라인 함수 지양).
- `src/features/lightbox/components/ImageLightbox.tsx` — 자체 오버레이 → Radix `Dialog` 기반 전환, `<img>` → `next/image`, `DialogDescription` 명시(a11y).
- `src/features/lightbox/components/LightboxProvider.tsx` — 불필요한 `useCallback`/`useMemo` 3건 제거(React Compiler 위임, `react.md` 성능 규칙).
- `src/shared/components/mdx/MdxPre.tsx` — `setTimeout` → `useEffect` cleanup.
- `src/shared/components/mdx/MdxLink.tsx` — 외부 링크 아이콘 옆에 `sr-only`로 "(새 창에서 열림)" 고지(WCAG 2.4.9/3.2.5).
- `src/shared/ui/Dialog.tsx` · `src/shared/ui/Sheet.tsx` — 닫기 버튼 `sr-only` 레이블 `"Close"` → `"닫기"` 현지화.

**검증**

- `pnpm lint` · `pnpm build` exit 0. 16 페이지 정적 생성 성공.
- `compound-reviewer` PASS 판정.

**미커밋 상태**

- 누적 변경(수정 22 + 신규 4)은 `workflow.md` 절대 금지 규칙에 따라 **사용자 명시 승인** 후에만 커밋.

### Tailwind Canonical Variants 보강 (2026-04-15)

**문제**

- VSCode Tailwind extension `suggestCanonicalClasses` 경고가 shadcn primitive의 arbitrary variant(`data-[disabled]`·`data-[state=open]`·`data-[side=*]`·`data-[variant=destructive]`·`[&_svg]` 등)로 인해 대량 발생. `styling.md` 회고·`shadcn.md` 후처리 5번에서 수차례 지적됐으나 shadcn 원본 복사 시점에 재발.

**해결**

- `src/shared/styles/globals.css`에 `@custom-variant` 14종 등록: `state-open`/`state-closed`/`state-checked`/`state-unchecked`, `side-top`/`side-right`/`side-bottom`/`side-left`, `variant-destructive`, `state-open-child-svg`, `variant-destructive-svg`, `child-svg`, `child-svg-no-size`, `child-svg-no-color`.
- shadcn 컴포넌트 5개 전면 치환(`DropdownMenu`·`Dialog`·`Sheet`·`Accordion`·`ImageLightbox`) — 모든 `data-[...]`·`[&_svg...]`·`[&[data-state=...]>svg]` arbitrary 표현을 canonical variant로 일괄 전환.
- `src/**/*.tsx` 전수 grep: `data-\[`·`\[&_`·`\[&\[` **0건**. IDE 경고 원천 제거.

### 추가 수정 (compound-reviewer Tier 2 + GC 드리프트 대응)

- `src/features/posts/services/getPostBySlug.ts` 신규 — GC 드리프트 #1(detail 페이지 SSOT) 대응. `src/app/posts/[slug]/page.tsx` `postsFixture.find` 2곳 치환.
- `src/features/posts/services/getPublicPosts.ts` — 동률 날짜 정렬 불안정 대응. 비교 함수를 `getTime()` 수치 차이(안정 정렬)로 교체.
- `src/features/lightbox/components/ImageLightbox.tsx` — `aria-describedby={undefined}`(의도 모호) 제거 후 `DialogPrimitive.Description` 명시.

### 컴포넌트 내부 헬퍼 분리 (2026-04-15)

- `src/features/series/services/getAdjacentInSeries.ts` 신규 — `SeriesNavigation.tsx`의 내부 `findAdjacentInSeries` 함수를 service로 승격. `SeriesAdjacency` 타입 export로 반환 타입 재사용 가능. `features/posts/services/getAdjacentPosts.ts`와 대칭 구조 확보.
- `src/features/series/services/index.ts` 신규 (barrel), `src/features/series/index.ts`에 re-export 추가.
- `src/features/series/components/SeriesNavigation.tsx` — 내부 함수 제거, `../services` import + unused `PostSummary` import 정리.

### 배럴 파일 정책 명문화 (2026-04-15)

**배경**

- Next.js App Router에서 `"use client"`는 파일 경계에서 작동. 배럴이 클라이언트 컴포넌트를 re-export하면 RSC 호출자의 모듈 그래프가 오염될 위험.
- Turbopack tree shaking이 실질적으로 해결하지만, 번들러 구현 디테일이지 공식 보장이 아님.
- `shared/components/{common,layouts,mdx,ui}/` 에 배럴 생성 시도 → 서버/클라이언트 혼재 문제 인지 → 생성 취소.

**정책 (project-structure.md §배럴 정책 신설)**

- `features/<f>/index.ts` · `features/<f>/components/index.ts` · `features/<f>/services/index.ts`: 유지 (Public API 경계 + Turbopack 트레이드오프)
- `shared/{types,fixtures}/index.ts`: 유지 (타입/데이터 전용)
- `shared/components/{common,layouts,mdx,ui}/`: **배럴 생성 금지** (서버·클라이언트 혼재, 직접 경로만)
- `shared/{hooks,utils,config}/`: 배럴 생성 금지 (파일 수 적음, 직접 경로 충분)
- features 배럴에 서버/클라이언트 구분 주석 적용, export 20+ 초과 시 split barrel 전환 트리거 명시.

**룰 동기화**

- `.claude/rules/project-structure.md` §배럴 정책 섹션 신설 (허용/금지 매트릭스, split 전환 트리거, 회고).
- `.claude/rules/typescript.md` Import/Export 섹션에 서버/클라이언트 혼재 경고 추가.
- `features/posts/index.ts` · `features/series/index.ts` 주석 정비 (Components/Services/Types 3구간 구분).

### HomeHero → features/about 이동 (2026-04-15)

- `src/app/HomeHero.tsx`는 `project-structure.md §4.1` "app/ 내부 허용 조건 3요건" 중 **2번(feature 2+ import) 미충족** 상태로 배치되어 있음 — 사용자 지적 후 `src/features/about/components/HomeHero.tsx`로 이동.
- `src/features/about/components/index.ts` · `src/features/about/index.ts` barrel에 `HomeHero` re-export 추가.
- `src/app/page.tsx` import: `./HomeHero` → `@/features/about`. ESLint `--fix`로 import sort 2파일 정렬.
- `.claude/rules/project-structure.md §4.1`에 회고 블록 추가 — 이 유형의 누락 재발 방지.

### shared/components 구조 개편 (2026-04-15)

**배경**

- `src/shared/components/` 루트에 13개 tsx 평탄 배치 → 탐색 피로 누적. shadcn primitive는 `src/shared/ui/` 별도 디렉토리라 혼재 신호.
- 사용자 요청으로 "shared 내 모든 tsx는 components 아래에서 관리" 원칙 채택(대안 A).

**변경**

- 최종 구조 (루트 직하 tsx 금지, 4개 서브로 완전 분류):
  ```
  src/shared/components/
  ├── common/    NavLink, SocialLinks, ScrollReset, ScrollToTopButton, FadeInWhenVisible, PageTransition
  ├── layouts/   Header, Footer, MobileMenu, Container, Sidebar
  ├── mdx/       (기존 유지)
  └── ui/        Accordion, Badge, Dialog, DropdownMenu, Sheet, Sonner (shadcn)
  ```
- 1차 루트 배치(`common/` 제외) → 2차 사용자 일관성 요청 → `common/` 신설로 루트 평탄 제거.
- `src/shared/ui/` 디렉토리 제거. 내부에 잘못 떨어져 있던 OMC state 로그(`.omc/state/last-tool-error.json`)도 정리.
- `components.json` `aliases.ui`: `@/shared/ui` → `@/shared/components/ui`.
- `sed` 일괄 치환: `@/shared/ui/*` → `@/shared/components/ui/*` (12파일), `@/shared/components/{Header,Footer,Container,Sidebar,MobileMenu}` → `.../layouts/*` (10+ 파일).
- layouts 내부 상대 경로 3건 `./NavLink`·`./SocialLinks` → `../` 재배치.
- `pnpm lint --fix`로 `simple-import-sort` autofix 3파일 적용.

**룰 동기화**

- `.claude/rules/project-structure.md §2` 표준 디렉토리 트리의 `shared/components/` 설명을 "평탄 구조" → "`layouts/`·`mdx/`·`ui/` 서브 + 루트 단일 컴포넌트 혼용"으로 갱신.

**검증**

- `pnpm lint` · `pnpm build` exit 0, 16 페이지 정적 생성 성공.

### Added

- **[M0-01]** Primitive/Semantic 색상 팔레트를 `src/shared/styles/tokens.css`에 CSS-only로 일원화 — light 기본 + `.dark` 오버라이드, `color-scheme` 직접 선언 (ADR-011). 별도 TS 팔레트 파일을 두지 않음 (SSOT = CSS, Tailwind 4 철학 준수).
- **[M0-02]** Typography 스케일을 `src/shared/styles/globals.css` `@theme inline`에 CSS-first로 정의 — Display/H1~H4/BodyLg/Body/BodySm/Label/Caption 10단계. Tailwind 4 `--text-*--line-height` 수정자 문법을 사용해 `text-display`, `text-h1`, `text-body` 등 유틸 하나에 size + line-height + font-weight + letter-spacing을 한꺼번에 적용.
- **[M0-03]** Semantic CSS 변수 토큰 — Surface·Text·Border·Accent·Feedback·Code·Focus·Shadow·Radius·Container·Z-index 범주 모두 `tokens.css` `:root` + `.dark` 쌍으로 정의.
- **[M0-04]** 기반 스타일 파일 — `base.css` (reset·focus·prefers-reduced-motion), `animations.css` (fade/scale/slide keyframes + View Transitions), `prose.css` (MDX 본문), `scrollbar.css`, `shiki.css` (코드블록 컨테이너).
- **[M0-05]** Tailwind CSS 4 `@theme inline` 블록에 Semantic 토큰 연결 (`src/shared/styles/globals.css`) — `bg-*`, `text-*`, `border-*`, `shadow-*`, `rounded-*`, `animate-*` 유틸이 토큰 변수 기반으로 작동.
- **[M0-06]** `cn()` 유틸 (`src/shared/utils/cn.ts`) — `clsx` + `tailwind-merge` 조합. shadcn/ui 표준 패턴.

- **[M0-07]** Pretendard Variable 폰트 설정 확인 (`src/app/layout.tsx`) — `next/font/local`의 `localFont` 사용, `--font-pretendard` CSS 변수, `display: swap`, weight 45~920, Apple SD Gothic Neo·Malgun Gothic fallback.
- **[M0-08]** `lucide-react` 아이콘 라이브러리 도입 — `.claude/rules/icons.md` 규칙 문서 신규 추가 (lucide-react 단일화 원칙, 커스텀 브랜드 SVG는 `src/shared/assets/icons/*.svg`, svgr 설정은 실제 첫 커스텀 SVG 시점에 지연 도입).
- **shadcn/ui 초기화** — `components.json` 신규 (alias: `ui=@/shared/ui`, `utils=@/shared/utils/cn`, `lib=@/shared/utils`). `Sheet` 컴포넌트 추가 (`src/shared/ui/Sheet.tsx`, kebab→PascalCase 리네이밍). `globals.css @theme inline`에 shadcn 표준 키(`--color-background`/`--color-foreground`/`--color-muted`/`--color-border`/`--color-ring` 등) alias 추가 — 컴포넌트 코드 수정 없이 우리 Semantic 토큰 자동 사용.
- **[M0-09]** `Header.tsx` — sticky 헤더, 데스크톱 네비, `searchSlot`/`themeSlot`/`mobileMenuSlot`. `Container` + `NavLink` 조립.
- **[M0-10]** `Footer.tsx` — 저작권, RSS 링크, "맨 위로" 앵커, `socialLinksSlot`.
- **[M0-11]** `Container.tsx` — 반응형 max-width 래퍼. `size="default"`(72rem) | `size="prose"`(44rem).
- **[M0-12]** `Sidebar.tsx` — `<aside>` 단순 컨테이너. md+ sticky 우측, md 미만 본문 아래 자동 배치.
- **[M0-13]** `MobileMenu.tsx` — shadcn `Sheet`를 **직접 사용** (별도 Drawer wrapper 생략, 사용자 요청 반영). 햄버거 트리거 + 우측 슬라이드 시트 + 네비/소셜 슬롯.
- **[M0-14]** `NavLink.tsx` — `usePathname` 기반 활성 경로 하이라이트, `aria-current="page"`.
- **[M0-15]** `SocialLinks.tsx` — props 주입형 소셜 링크 묶음 (`label`/`href`/`icon`), 외부 링크 `target="_blank" rel="noopener noreferrer"`.

### Changed (M0-09~15 — 컴파운드 사이클 REVIEW 적용)

3개 리뷰 에이전트(react-nextjs-code-reviewer · a11y-auditor · feature-dev:code-reviewer) 병렬 감사 결과 13개 이슈 일괄 수정.

- **MobileMenu**: `SheetClose asChild` + `NavLink` 적용 — 메뉴 항목 클릭 시 Sheet 자동 닫힘 + 포커스 트리거 복원 + `aria-current="page"` 일관. `SheetDescription`(sr-only) 추가로 Radix dev 경고 제거.
- **NavLink**: `target === "/"` 매칭 가드(모든 경로 활성화 회귀 방지), `href.pathname` nullish 안전 처리, 활성 표시에 underline 비색상 단서(WCAG 1.4.1), `focus-visible:ring` ring.
- **SocialLinks**: `SocialLink` type 외부 `export` 제거(`components.md` "Props 미노출" 룰), `focus-visible` ring.
- **Header**: skip link `<a href="#main-content">` 추가 (WCAG 2.4.1 Bypass Blocks), 로고 `aria-label="chan9yu 홈"`.
- **Footer**: import 순서 정렬(`typescript.md`), `<nav aria-label="보조 링크">` 그룹화 + `<h2 sr-only>` landmark heading, `new Date()` 빌드 타임 의도 주석. `ScrollToTopButton`을 별도 client island로 분리 (Footer는 RSC 유지).
- **ScrollToTopButton (신규)**: `src/shared/components/layout/ScrollToTopButton.tsx`. `window.scrollTo({behavior:"smooth"})` + `document.getElementById("main-content")?.focus()` — Footer "맨 위로" 클릭 시 시각 스크롤 + 키보드 포커스 동시 이동 (WCAG 2.4.3).

> **Skip link 의존성**: layout.tsx에 `<main id="main-content" tabIndex={-1}>` 추가 필요. M0-31(providers 래핑) 또는 라우팅 쉘 작업 시 통합 예정.

### Harness (하네스 보강 — REVIEW 누락 회귀 차단)

회고 결과 M0-01~06, M0-09~15에서 EXECUTE → DOCUMENT 직행으로 **REVIEW 단계 누락** (사후 3-way 리뷰에서 13+개 이슈 발견). 같은 패턴이 다음 사이클에서 반복되지 않도록 룰·스킬·메모리·placeholder를 일괄 보강.

- **`.claude/rules/review-discipline.md` 신규** — REVIEW 단계 강제 룰. trigger·how·penalty·self-check 명시. 회고 사례를 본문에 박아 살아있는 룰로 유지.
- **`.claude/skills/blog-dev/skill.md` Phase 3 강화** — EXECUTE 직후 트랙별 3-way 리뷰 에이전트 병렬 호출 자동화 절차 명시.
- **`.claude/skills/compound-engineering/skill.md` REVIEW 섹션 강화** — Self-stop 가드 + DOCUMENT 진입 전 self-check 체크리스트 추가.
- **메모리 3종 추가** (`~/.claude/projects/.../memory/`):
  - `feedback_review_discipline.md` — REVIEW 강제 (사용자 명시 피드백)
  - `feedback_shadcn_first.md` — UI primitive shadcn-first 원칙
  - `project_temp_data_single_source.md` — 임시 데이터 단일 source
  - `MEMORY.md` 인덱스 4개 항목으로 갱신
- **`src/shared/config/site.ts` placeholder 신규** — `siteNav` 단일 source. M0-33 본 작업 전이라도 Header/MobileMenu가 동일 nav 데이터를 두 곳에 hardcoded하지 않도록 차단.
- **`Header.tsx`, `MobileMenu.tsx` 마이그레이션** — `DEFAULT_NAV` 인라인 상수 제거, `siteNav` import로 일원화 (DRY 즉시 차단).

### Changed (사용자 직접 리뷰 — Tailwind canonical & shadcn 룰 정리)

- **`.claude/rules/styling.md` 강화** — Tailwind arbitrary value(`[..]`, `(--..)`) 사용 금지 명문화. `suggestCanonicalClasses` 워닝 = 즉시 변환 대상. 금지→사용 매핑 표 + 새 토큰 추가 가이드.
- **`.claude/rules/shadcn.md` 강화** — shadcn add 후 후처리 절차(필수) 추가:
  - PascalCase 리네이밍 → React 네임스페이스 import 제거 → 인라인 type 분리 → 빌드 검증
  - Compound 패턴 적용 범위 명확화 (우리 자체 도메인 컴포넌트만, shadcn primitive는 named export 그대로)
- **`src/shared/ui/Sheet.tsx`** — 우리 룰 일괄 적용:
  - `import * as React from "react"` → `import type { ComponentProps } from "react"`
  - `React.ComponentProps<typeof X>` → `ComponentProps<typeof X>` (9곳)
  - 인라인 type → 9개 별도 `type` 선언 (SheetProps, SheetTriggerProps, … SheetDescriptionProps)
  - shadcn 표준 className은 그대로 유지 (upstream sync 보장)
- **`Container.tsx`, `Header.tsx`, `Footer.tsx`, `MobileMenu.tsx` arbitrary → canonical 마이그레이션**:
  - `max-w-[72rem]` → `max-w-content` (우리 토큰 자동 생성)
  - `max-w-[44rem]` → `max-w-prose` (우리 토큰으로 Tailwind 기본 65ch 오버라이드)
  - `border-(--color-border-subtle)` → `border-border-subtle` (`@theme inline` 자동 매핑)

### Changed (사용자 직접 리뷰 — shadcn Compound 패턴 적용)

사용자 원본 shadcn 룰 복원 — shadcn primitive도 `Object.assign` Compound 패턴으로 통일. 직전 리뷰에서 제가 추가했던 "named export 그대로 유지" 섹션은 잘못된 해석으로 제거.

- **`.claude/rules/shadcn.md`**:
  - "Compound 패턴 적용 범위" 섹션(named export 예외) **제거**
  - "shadcn add 후 후처리 절차"에 **4단계 Compound 패턴 적용** 추가
- **`src/shared/ui/Sheet.tsx`**:
  - 9개 named export → 단일 `export const Sheet = Object.assign(SheetRoot, { Trigger, Close, Portal, Overlay, Content, Header, Footer, Title, Description })`
  - 개별 함수명은 `SheetRoot`, `SheetTrigger` 등 부모 prefix 유지
- **`src/shared/components/layout/MobileMenu.tsx`**:
  - 7개 named import → 단일 `import { Sheet }`
  - JSX: `<SheetTrigger>` → `<Sheet.Trigger>`, `<SheetContent>` → `<Sheet.Content>` 등 점 네임스페이스
  - TypeScript 추론 정상, 빌드 통과

### Changed (전체 문서·하네스 정화 — M0 완료 기준 최신화)

ultrathink 모드에서 2개 Explore 에이전트 병렬 감사 → Tier A(drift) + B(중복) + C(삭제) 전면 적용.

**Drift 제거** (M0 결정과 문서 불일치):

- **docs/ROADMAP.md**: §M0 진행률 `15/33 → 33/33`. 개별 체크박스 `[ ] → [x]` 일괄 동기화 (replace_all, M1 이하는 영향 없음). 선행 결정 요약에 M0-30·M0-31·M0-33 결과 추가.
- **docs/TASKS.md**: M0-09 경로 `shared/components/layout/ → shared/components/` (평탄화 반영).
- **docs/AI_WORKFLOW_GUIDE.md**: "13개 규칙" → "15개" 전면 교체. L51에 현재 15개 룰 목록 상세 열거. §L831 "13개 코딩 규약" → "15개".
- **CLAUDE.md**: M0 상태 `15/33 → 33/33 완료`, M1 대기 중 명시. 규칙 수 "15개" 확정.
- **`.claude/skills/garbage-collection/skill.md`**: L110 `shared/styles/foundations/*.ts` → `shared/styles/tokens.css` (`@theme inline` 블록 동시 점검 의도 추가). "13개" → "15개" 일괄 + 룰 목록 상세화.
- **`.claude/skills/garbage-collection/references/rule-violations.md`**: "13개" → "15개".
- **`.claude/skills/blog-dev/skill.md`**: "13개 규칙" → "15개 규칙".
- **`.claude/agents/quality/garbage-collector.md`**: description + 본문 4군데 "13개" → "15개".
- **`.claude/agents/quality/compound-reviewer.md`**: 본문 2군데 "13개 파일"·"13개 전부" → "15개".
- **`.claude/commands/review/quality.md`**: 체크리스트 "13개 규칙" → "15개".

**Cross-reference 추가** (중복 대신 링크화):

- **`.claude/rules/components.md`**: Props 미노출 조항에 shadcn 예외 참조(`shadcn.md` "import 규칙") 추가 — 두 룰 간 충돌 해소.
- **`.claude/rules/autonomy.md`**: "관련 룰" 섹션 신설 — `review-discipline.md`(품질 게이트), `workflow.md`(Git 쓰기 절대 금지) 참조.
- **`.claude/rules/review-discipline.md`**: "관련 룰" 섹션 신설 — `autonomy.md`(범주), `compound-engineering/skill.md`(Phase 정의) 참조.

**삭제 (stale·unused 자산)**:

- `.claude/plans/playful-discovering-parrot.md` (M0 중간 stale plan).
- `.claude/plans/` 빈 디렉토리 제거.
- `.claude/agent-memory/*` 빈 디렉토리 9개 전부 제거 (프로젝트에서 persistent agent memory 미사용).
- `.claude/skills/vercel-react-best-practices/rules/rendering-content-visibility.md` (SSG-first 프로젝트에 무관한 긴 리스트 가상화 예시).

**하네스 health**: 77 → 85+ 예상. 구조적 결함 없음, 정보·조직 일관성 확보.

### Added (M0-30~M0-33: 인프라 마무리, M0 Foundation 100%)

- **[M0-30]** `app/not-found.tsx` — 404 페이지. `Container` 재사용, 홈으로 돌아가기 CTA, focus-visible ring.
- **[M0-31]** `app/providers.tsx` — `next-themes` `ThemeProvider`로 루트 래핑. `attribute="class"`·`enableColorScheme={false}`·`defaultTheme="system"`·`disableTransitionOnChange` (ADR-011·theme.md). `layout.tsx`에 `<html suppressHydrationWarning>` + `<Providers>` 통합.
- **[M0-32]** tsconfig path alias 검증 — `"@/*": ["./src/*"]`이 src 전반에서 23+회 사용되고 빌드 통과 확인.
- **[M0-33]** `shared/config/site.ts` 확장 — `siteMetadata` 보강(`ogImage`, `themeColor`), `siteSocials` 배열(GitHub/LinkedIn/Email + `iconName` lucide 식별자) 추가. Footer·About의 소셜 링크 단일 source.

### Dependencies (M0-31)

- `next-themes` (prod) — class 기반 light/dark + hydration 안전 + `useSyncExternalStore` 내장. ADR-011 표준.

### Added (M0-16~M0-29: 라우팅 쉘 14종)

14개 라우트가 모두 404 없이 빈 페이지 또는 적절한 응답 렌더. 실데이터는 M1~M5에서 단계적 교체.

- **정적 페이지 5종**: `app/page.tsx`(홈), `app/posts/page.tsx`, `app/tags/page.tsx`, `app/series/page.tsx`, `app/about/page.tsx` — 각 metadata(title·120~160자 description·canonical) + placeholder 마크업
- **동적 페이지 3종** (PPR 모드): `app/posts/[slug]/page.tsx`, `app/tags/[tag]/page.tsx`, `app/series/[slug]/page.tsx` — async params + `normalizeSlug` validation + `notFound()` 가드 + `generateMetadata` decoded canonical
- **Route handlers 6종**: `app/rss/route.ts`(escapeXml + Cache-Control), `app/sitemap.ts`, `app/robots.ts`(preview 차단), `app/manifest.ts`, `app/og/route.tsx`(ImageResponse + title slice), `app/api/views/route.ts`(slug 검증 + 타입 가드)
- **layout.tsx**: `metadataBase` = `getSiteUrl()` 환경 분기, `openGraph`/`twitter` 루트 메타, `<main id="main-content" tabIndex={-1}>` + skip link(Header 통합 전 임시)
- **loading.tsx 신규** (M0-30 선행): cacheComponents 요구사항 해결, `role="status"` + sr-only, 한국어 메시지
- **shared/utils/xmlEscape.ts 신규**: RSS·sitemap 인젝션 방지 유틸 (M5 대비)
- **shared/config/site.ts 확장**: `siteMetadata`(title·description·url·locale) + `getSiteUrl()` 환경 분기 함수

### Changed (리뷰 사이클 반영 — 3-way 병렬 12 이슈 일괄)

3개 리뷰어(react-nextjs-code-reviewer · a11y-auditor · feature-dev:code-reviewer) 합의 이슈 + 사용자 지적 반영.

- **Tier 1 Critical**: 동적 slug decode + validation + notFound, description 120~160자 규약, openGraph/twitter 메타, API route 타입 가드, RSS XML escape, loading.tsx 한글화·ARIA 중복 제거
- **Tier 2 품질**: metadataBase 환경 분기, skip link 임시 추가, robots.ts `host` 제거, og title slice, tags `#` 접두 aria-hidden, generateStaticParams 빈 배열 → cacheComponents 제약으로 생략(PPR 모드)
- **리턴 타입 자동 추론**: `typescript.md` 룰 준수 — `getSiteUrl()`·`normalizeSlug()`·`escapeXml()`·`robots()`·`sitemap()`·`manifest()`·`generateMetadata()` 등 자동 추론 가능한 시그니처에서 명시 리턴 타입 제거 (사용자 직접 지적)

### Changed (디렉토리 평탄화 — 뎁스 축소)

사용자 피드백 반영: `shared/ui/`가 shadcn 전용으로 분리되어 있으므로 우리 컴포넌트의 `shared/components/layout/` 2단 구조는 과도.

- `src/shared/components/layout/*.tsx` (8개) → `src/shared/components/`로 이동
- `layout/` 빈 디렉토리 제거
- 컴포넌트 간 상대 경로 import(`./Container` 등)는 같은 디렉토리 내라 자동 유효 (수정 불필요)
- `.claude/rules/project-structure.md` 갱신 — `shared/components/` 평탄 구조 명시

### Changed (문서 최신화 — drift 정리)

코드·룰 변경 이후 문서에 남은 잔존 정보(drift)를 일괄 제거.

- **README.md**: 규칙 수 "13개" → "15개" (`icons.md` + `review-discipline.md` 추가 반영)
- **CLAUDE.md**: 규칙 수 갱신 + M0 Foundation 현재 진행 상태(15/33) 문서 상단에 명시
- **docs/ROADMAP.md**:
  - M0 섹션 상단에 "진행 상태 + ROADMAP 작성 이후 결정 변경" 요약 추가 (CSS-only / `components/` 평탄화 / Drawer→Sheet)
  - M0-01 경로: `shared/styles/foundations/colors.ts` → `shared/styles/tokens.css`
  - M0-02 경로: `shared/styles/foundations/typography.ts` → `shared/styles/globals.css @theme inline`
  - M0-13 표기: `Drawer.tsx + MobileMenu.tsx` → `MobileMenu.tsx` (shadcn `Sheet` 직접 사용)
- **docs/PRD_TECHNICAL.md**:
  - §8.1 디자인 토큰: 2-layer(foundations TS + tokens CSS) → **CSS-only SSOT**. shadcn alias 매핑·arbitrary value 금지 원칙 추가
  - §8.2 공통 컴포넌트: `Drawer.tsx` 제거, `ScrollToTopButton.tsx` 추가, 평탄 구조 명시
  - §16 디렉토리 구조: `styles/foundations/` 제거, `components/` 평탄화, `ui/` (shadcn primitives) 별도 명시
- **docs/AI_WORKFLOW_GUIDE.md**: 상단 개요에 **REVIEW 단계 생략 금지** 박스 추가 (`.claude/rules/review-discipline.md` 참조)

중복 점검: `autonomy.md` ↔ `workflow.md` Git 쓰기 규칙이 부분 겹침이지만 각 문서 맥락이 달라 유지 (autonomy는 자율 경계, workflow는 실행 절차). 15개 룰 파일 간 치명적 중복은 없음.

### Added (M1-01~M1-05: Fixture 데이터 레이어 + M1-15 선행 서브셋)

M1 UI Skeleton 진입 첫 구간. 더미 fixture 5종을 생성해 이후 모든 페이지·컴포넌트 작업의 기반 제공. 타입 정의(M1-15)는 fixture가 import해야 하므로 필요 서브셋(`PostSummary`·`PostDetail`·`TocItem`·`Series`·`TagCount`·`TrendingSnapshot`)만 선행 생성 — `AdjacentPosts`·`RelatedPost`는 M1-15 본편에서 보충.

- **[M1-01]** `src/shared/fixtures/posts.ts` — `PostSummary` 13건 (public 12 + private 1). 시리즈 3종(react-19-deep-dive 3편 · nextjs-app-router-patterns 3편 · typescript-type-system 2편) + 스탠드얼론 5편. thumbnail 7/13 할당(6건 null). date desc 정렬.
- **[M1-02]** `src/shared/fixtures/post-details.ts` — `PostDetail` 대표 3건 (시리즈·스탠드얼론·private 각 1). `findSummary` helper로 `postsFixture` 참조, slug 누락 시 module-level throw로 경계 불일치 조기 감지. toc·contentMdx heading 1:1 매칭.
- **[M1-03]** `src/shared/fixtures/tags.ts` — `TagCount` 20종. `aggregateTagCounts()` 함수로 `postsFixture`에서 **derive**(3-way 리뷰 Tier 2 반영). private 포스트 태그(`meta`) ADR-007 정책에 따라 자동 제외. count desc / tag asc 정렬.
- **[M1-04]** `src/shared/fixtures/series.ts` — `Series` 3개. `postsFixture`에서 filter+sort로 derive. seriesOrder 오름차순 보장.
- **[M1-05]** `src/shared/fixtures/trending.ts` — `TrendingSnapshot` 1개. posts/tags/series에서 파생(popularPosts 5건 · trendingSeries 3건 · trendingTags 10건). `generatedAt` 고정 ISO로 재현성 확보. popularPosts는 KV 부재로 "최근 발행순 fallback"으로 의도 대체(M4-13에서 실 스냅샷 생성기로 교체).
- **shared/fixtures/index.ts·shared/types/index.ts** — leaf barrel. PRD_TECHNICAL §5.1 Zod 스키마 필드 시그니처와 동일 (M2 `z.infer` 교체 무손실).

### Changed (M1-01~05 — 컴파운드 사이클 REVIEW 적용)

3개 리뷰 에이전트(react-nextjs-code-reviewer · boundary-mismatch-qa · feature-dev:code-reviewer) 병렬 감사 결과.

- **Tier 2**: `tagsFixture` 수동 정적 배열 → `aggregateTagCounts` derive 함수로 전환. SSOT 단일화로 `postsFixture` 변경 시 silent drift 차단. 런타임 sanity check으로 기존 수동 집계 결과(top3 react=5 / nextjs=3 / react-19=3 / 총 20종 / `meta` 미포함)와 1:1 일치 확인.
- **Tier 2**: `findSummary` module-level throw의 의도를 주석으로 명시(fixture 단계 경계 불일치 조기 감지 가드).
- **Tier 1 정책 반영 (사용자 승인 옵션 A)**: PRD_TECHNICAL `thumbnail: string | null` vs mdx-content.md/seo.md `cover: {src, alt}` 규약 충돌을 **실데이터 우선 원칙**으로 해결. 기존 MDX 포스트 frontmatter가 이미 `thumbnail: "..."` 평탄 문자열을 사용 중이므로 `.claude/rules/mdx-content.md` frontmatter 예시·`.claude/rules/seo.md` OG 설명을 `thumbnail`로 통일. alt 텍스트 별도 필드는 도입하지 않고 렌더 시점에 `frontmatter.title`을 재사용하는 컨벤션 채택(WCAG 1.1.1 충족, 데이터 중복 회피). 파일명 예시도 일관화: `docs/PRD_PRODUCT.md` §7.1 표 / §7.2 디렉토리 트리 / §7.4 썸네일 경로를 `cover.png`·`cover.{ext}` → `thumbnail.png`·`thumbnail.{ext}`로 통일(실제 기존 포스트 `/posts/{slug}/images/thumbnail.png`와 일치).
- **Tier 3 후속 이관**: Zod refine(`series`/`seriesOrder` 동시 null 제약)의 discriminated union 표현, `seriesSlug` literal union 도입, `TagCount.slug` 중복 필드 재검토 — M1-15 본편 또는 M2 Zod 스키마 설계 시 처리.

### Added (M1-06~M1-14: Feature 모듈 뼈대)

9개 feature의 Public API barrel(`src/features/{name}/index.ts`)을 PRD_TECHNICAL §7.1~7.9 계약을 주석으로 반영한 placeholder로 생성. 각 파일은 shared/types만 재export하거나 `export {}`로 모듈 마킹하며, 실 컴포넌트/훅/서비스는 M1-22+ / M2 / M3 / M4 단계에서 단계적으로 추가된다.

- **[M1-06]** `features/posts/index.ts` — MOD-posts. `PostDetail`·`PostSummary`·`TocItem`·`TrendingSnapshot` 재export. `AdjacentPosts`·`RelatedPost`는 M1-15 본편에서 보충.
- **[M1-07]** `features/tags/index.ts` — MOD-tags. `TagCount` 재export.
- **[M1-08]** `features/series/index.ts` — MOD-series. `Series` 재export.
- **[M1-09]** `features/search/index.ts` — MOD-search. `SearchResult` 전용 타입은 M3 구현 시 feature 내부에서 정의.
- **[M1-10]** `features/views/index.ts` — MOD-views. M3에서 KV 클라이언트·ViewCounter 등 채움.
- **[M1-11]** `features/comments/index.ts` — MOD-comments. Giscus lazy-mount는 M3.
- **[M1-12]** `features/theme/index.ts` — MOD-theme. ThemeProvider는 현재 `app/providers.tsx`에 있으며 Provider 2+ 시점(M3)에 이관.
- **[M1-13]** `features/lightbox/index.ts` — MOD-lightbox. `MdxImage` 연동은 M3.
- **[M1-14]** `features/about/index.ts` — MOD-about. `getAboutContent`는 M4.
- **1-way REVIEW (feature-dev:code-reviewer)** — 9개 파일 전부 고신뢰도 이슈 0건. Law 2/3 준수, leaf barrel 원칙 유지, TypeScript strict 위반 없음.

### Added (M1-15: 공통 타입 본편)

- **[M1-15]** `src/shared/types/post.ts`에 `AdjacentPosts`·`RelatedPost` 타입 2종 추가. M1-01~05 단계에서 선행 생성한 타입 서브셋(PostSummary·PostDetail·TocItem·Series·TagCount·TrendingSnapshot)과 합쳐 PRD_TECHNICAL §5.2 정의 전체를 구현 완료.
- `src/shared/types/index.ts` barrel 업데이트 — 2종 추가 export.
- `src/features/posts/index.ts` 갱신 — placeholder 주석의 "M1-15 본편에서 보충" 문구 제거, `AdjacentPosts`·`RelatedPost` 재export 추가로 MOD-posts 공개 API의 타입 계약(PRD §7.1) 완성.

### Added (M1-16~M1-21: 홈 FEAT-HOME UI)

홈 페이지의 Hero·최근 포스트·사이드바(Popular Posts·Trending Series·Trending Tags)를 더미 fixture 기반으로 완성. 레거시 `.backup/src/app/page.tsx` UX를 현 프로젝트 토큰·규약(shadcn alias·Tailwind 4 표준)으로 번역.

- **[M1-16]** `src/app/HomeHero.tsx` — H1 + 소개 2문단 + "최신 글 보기" CTA + SocialLinks. `lucide-react` 최신 버전에서 Github/Linkedin 브랜드 마크가 제거되어 `Code2`/`Briefcase`로 임시 대체(향후 `@svgr/webpack` 도입 시 공식 브랜드 SVG로 교체).
- **[M1-17]** `src/features/posts/components/PostCard.tsx` — RSC 카드(`variant: "list" | "grid"`). `fs.existsSync`로 썸네일 파일 존재 확인 + `/posts/placeholder.svg` 폴백. `priority` prop으로 LCP 후보 2장 지정. `motion-safe:` 가드로 prefers-reduced-motion 존중.
- **[M1-17]** `public/posts/placeholder.svg` — 1200×630 그라디언트 placeholder (썸네일 누락 시 사용).
- **[M1-18]** `src/features/posts/components/PopularPosts.tsx` — `<ol>` 5건 랭킹. 순번 `aria-hidden` + Link `aria-label`로 스크린리더 최적화.
- **[M1-19]** `src/features/series/components/TrendingSeries.tsx` — `<ul>` 3건. Link `aria-label`로 시리즈명·편수 음성 안내.
- **[M1-20]** `src/features/tags/components/TrendingTags.tsx` — 태그 chip 10건. Link `aria-label`로 태그명·글 수 안내.
- **[M1-21]** `src/app/page.tsx` — `Container` + `flex-col lg:flex-row` 반응형. main 영역 + sticky 사이드바(`lg:sticky lg:top-24 lg:w-64`). fixture 필터(`postsFixture.filter(!private).slice(0, 6)`)로 최근 포스트 주입.
- **barrel 업데이트**: `features/{posts,series,tags}/components/index.ts` leaf barrel 신규, 각 `features/*/index.ts`에서 컴포넌트 재export 추가.
- **공통 유틸**: `src/shared/utils/formatDate.ts` — dayjs 기반 `YYYY.MM.DD` 포맷.

### Changed (M1-16~21 — 컴파운드 사이클 REVIEW 적용)

3-way REVIEW(react-nextjs-code-reviewer · a11y-auditor · feature-dev:code-reviewer) 결과 반영.

- **Tier 1 a11y**: PostCard Image `alt={post.title}` → `alt=""` (h3 제목 중복 announce 제거, WCAG 1.1.1). "전체 보기 →" Link `aria-label="최근 포스트 전체 보기"` + `→`를 `<span aria-hidden>`으로 분리 (WCAG 2.4.4). PopularPosts 순번 `aria-hidden` + Link `aria-label="인기 포스트 N위: 제목"` (WCAG 1.3.1).
- **Tier 2 a11y**: PopularPosts/TrendingSeries Link에 `focus-visible:ring-2 ring-offset-2 ring-ring` 추가 (WCAG 1.4.1 색 단독 의존 해소). TrendingTags `text-[10px]` arbitrary → `text-xs`(styling 룰 위반 해결) + Link `aria-label` 추가. HomeHero `chan9yu` → `<span lang="en">chan9yu</span>` (한국어 TTS 철자 읽기 개선). `<aside>`에 `aria-label="추천 블록"` + 사이드바 섹션 H2를 `<span lang="en">`으로 감쌈.
- **Tier 2 React**: PostCard hover 애니메이션 `motion-safe:` 가드 (WCAG 2.3.3). `resolveThumbnailSrc` 함수에 "Node.js 런타임 전용, 클라이언트 호출 금지" 주석 + M2 services 레이어 이관 계획 명시. `SOCIAL_ITEMS`를 모듈 top-level 상수로 이전(렌더마다 JSX 재생성 회피).
- **Tier 2/3 후속 이관**: `fs.existsSync` → M2 `getAllPosts` 서비스 레이어에서 정규화(현재는 fixture 기반이라 성능 영향 작음). 브랜드 아이콘 공식 SVG + `@svgr/webpack` 도입(별도 태스크). page.tsx의 fixture 필터링 → `features/posts/services/getRecentPosts` 이관(M2).

### Added (M1-22~M1-60 + M1-61: 나머지 UI 대량 일괄)

사용자 "M1 일괄 끝내기" 지시로 포스트 목록·포스트 상세·MDX 컴포넌트·태그·시리즈·About·검색·조회수·테마·라이트박스·댓글·모션·shadcn primitives를 Phase 6분할로 완성. 각 컴포넌트는 동작하는 뼈대(fixture 기반 렌더·주요 UX 흐름 가능) 수준이며 실 로직은 M2~M4에서 보강된다.

**Phase B (M1-22~27 포스트 목록)**: PostCard variant list/grid + 썸네일 파일 존재 확인 유틸 `shared/utils/resolveThumbnail.ts` 서버 전용 분리. PostList (Client, useSyncExternalStore localStorage 뷰 토글 + 태그 필터 + IntersectionObserver 무한 스크롤 12건 페이지네이션). PostListSkeleton (Suspense fallback). app/posts/page.tsx 전면 재작성.

**Phase C (M1-28~43 포스트 상세 + MDX)**: ReadingProgress·ScrollToTop·ScrollReset·PostMetaHeader·Toc(IntersectionObserver current heading)·PostNavigation·RelatedPosts·ShareButtons(Clipboard+X+LinkedIn+Web Share)·MdxHeading(createElement)·MdxPre(복사 버튼)·MdxImage·MdxLink·MdxTable·Callout(4 variant)·CustomMDX 컴포넌트 맵·SeriesNavigation 배지 + 이전/다음 편. app/posts/[slug]/page.tsx 전면 재작성.

**Phase D (M1-44~49 태그·시리즈)**: TagChip(size sm/md) + app/tags/page.tsx TagHub + app/tags/[tag]/page.tsx TagDetail + app/series/page.tsx SeriesHub + app/series/[slug]/page.tsx SeriesDetail(numbered 타임라인).

**Phase E (M1-50~54 About + 검색 + Header/Footer 통합)**: AboutProfile · SearchTrigger(shadcn Dialog + input + 결과 리스트 + 인기 태그 빈 상태) · useSearchShortcut Cmd+K. app/layout.tsx 재구성 — Header(searchSlot/themeSlot) + Footer + ScrollReset 통합, cacheComponents 모드 대응을 위해 usePathname 사용 컴포넌트를 `<Suspense>`로 감쌈.

**Phase F (M1-55~60 조회수·테마·라이트박스·댓글·모션)**: ViewCounter · ThemeSwitcher(useSyncExternalStore 기반 mounted 감지로 react-hooks/set-state-in-effect 룰 준수) · LightboxProvider Context + useLightbox + ImageLightbox · CommentsSection(IntersectionObserver lazy-mount) · FadeInWhenVisible · PageTransition(CSS 기반, framer-motion 없음).

**Phase G (M1-61 shadcn)**: Dialog·DropdownMenu·Badge·Accordion·Sonner 추가 + shadcn.md 규약 적용(PascalCase 리네이밍·React 네임스페이스 교체). class-variance-authority 신규 의존성.

**후속 이관 항목 (Week 0 GC 또는 M2+)**: shadcn Compound 패턴 전환(Object.assign 패턴). 브랜드 아이콘 공식 SVG + @svgr/webpack 도입. HomeHero·AboutProfile의 ICON_MAP 중복 shared 승격. fixture 필터링 로직을 features/posts/services/로 이관. findAdjacent/findRelated 인라인 로직을 M4 서비스 레이어로 이관.

### Dependencies (M1)

- `dayjs` `^1.11.20` (prod, 신규) — ISO 날짜 포맷. 초기에는 `YYYY.MM.DD` 포맷만 사용, M1-28 포스트 상세에서 `relativeTime` 플러그인 + `locale/ko` 추가 예정.
- `class-variance-authority` `^0.7.1` (prod, 신규) — shadcn Badge의 cva 변형 시스템 의존.

### Milestone (M1 UI Skeleton) — 61/61 완료

M1 마일스톤의 모든 태스크가 완료되어 더미 fixture 기반으로 전 페이지 UI가 동작. Total 진행률 94/196 (48%). M1 Exit 기준("더미 데이터 기준 모든 FEAT-\* UI 통과, 네비게이션으로 UX 흐름 완결") 충족. milestone-gate 실행은 후속 단계에서 사용자 요청 시.

### Dependencies

- `clsx` (prod) — 조건부 className 결합.
- `tailwind-merge` (prod) — 충돌 Tailwind 유틸 뒤쪽 우선 해결.
- `lucide-react` (prod) — 단일화된 아이콘 라이브러리.
- `radix-ui` (prod) — shadcn `Sheet`가 사용하는 Radix Dialog 메타 패키지.
- `tw-animate-css` (prod) — shadcn `Sheet`의 `animate-in`/`slide-in-from-*`/`fade-out-0` 등 Tailwind 4 호환 애니메이션 유틸 제공.

### M2-12~17: 서비스 함수 TDD (getAllPosts · getPostDetail · sortPostsByDateDescending)

**M2-12 [Red] getAllPosts 테스트** — `services/__tests__/getAllPosts.test.ts` 신규 작성. 6개 케이스: private 필터링·includePrivate 옵션·날짜 내림차순·`@template` 디렉토리 스킵·frontmatter 오류 스킵·파일 없음 스킵. `vi.mock("node:fs")`로 FS 격리. `makeDirent` 헬퍼로 `Dirent` 최소 모사.

**M2-13 [Green] getAllPosts 구현** — `services/getAllPosts.ts` 신규 작성. `readdirSync(withFileTypes: true)`로 디렉토리 스캔 → `@` prefix 스킵 → `parseFrontmatter` 검증 → `includePrivate` 필터 → `sortPostsByDateDescending` 정렬. `POSTS_DIR` 상수를 `getPostDetail.ts`와 공유 export. 전체 테스트 통과.

**M2-14 [Red] getPostDetail 테스트** — `services/__tests__/getPostDetail.test.ts` 신규 작성. 6개 케이스: 유효한 slug → PostDetail 반환·contentMdx(frontmatter 제외)·toc h2/h3 순서 추출·ENOENT → null·private 포스트 반환(필터는 호출자 책임)·schema 검증 실패 → null.

**M2-15 [Green] getPostDetail 구현** — `services/getPostDetail.ts` 신규 작성. `readFileSync` → `parseFrontmatter` → `matter().content` → `calculateReadingTime` + `extractTocFromMarkdown` 조합. 예외 시 `null` 반환.

**M2-16 [Red] sortPostsByDateDescending 테스트** — `utils/__tests__/sortPostsByDateDescending.test.ts` 신규 작성. 5개 케이스: 날짜 내림차순·빈 배열·원본 불변성·ISO timestamp 포함·단일 항목.

**M2-17 [Green] sortPostsByDateDescending 구현** — `utils/sortPostsByDateDescending.ts` 신규 작성. `[...posts].sort()` 스프레드로 원본 보존, `Date.getTime()` 차로 내림차순.

**타입 정합성 수정**: 테스트 mock 타입 캐스트를 `as unknown as ReturnType<typeof fs.readdirSync>` / `as unknown as ReturnType<typeof fs.readFileSync>`로 교체 — `noUncheckedIndexedAccess` strict 모드에서 `NonSharedBuffer` 오버로드 불일치 해소. `pnpm tsc --noEmit` 클린, 테스트 53/53 통과.

---

### Added — M2-18~21 이미지 복사 + MDX 파이프라인 (2026-04-15)

**M2-18 `scripts/copy-content-images.mjs`** — mtime 비교 멱등 복사 + prune 스크립트. `contents/posts/{slug}/images/` → `public/posts/{slug}/images/` 동기화. `cpSync`/`rmSync`/`statSync`로 변경 파일만 복사, 소스에 없는 대상 디렉토리 제거.

**M2-19 `CustomMDX` async RSC 전환** — `src/shared/components/mdx/CustomMDX.tsx`를 `next-mdx-remote/rsc`의 `MDXRemote`를 사용하는 async Server Component로 재작성. 기존 `customMDXComponents` 객체 맵에서 `export async function CustomMDX`로 변경. `posts/[slug]/page.tsx`의 raw `<pre>` 플레이스홀더를 `<CustomMDX source={detail.contentMdx} />`로 교체.

**M2-20 Shiki 듀얼 테마** — `src/shared/libs/shiki.ts`: `React.cache()` + `createHighlighter()` 싱글톤(github-light/github-dark). `@shikijs/rehype/core`의 `rehypeShikiFromHighlighter` 연결, `defaultColor: false`로 CSS 변수 방식 듀얼 테마 활성화. `shiki.css`에 `.shiki span { color: var(--shiki-light) }` / `.dark .shiki span { color: var(--shiki-dark) }` 추가. Next.js 16 `cacheComponents: true` 환경의 `Date.now()` 사전 렌더 오류 방지를 위해 `CustomMDX`에 `"use cache"` 디렉티브 적용.

**M2-21 remark 플러그인** — `MDXRemote` `options.mdxOptions.remarkPlugins`에 `remarkGfm`(GFM 테이블·체크박스·취소선)과 `remarkBreaks`(줄바꿈 → `<br>`, 한국어 블로그 특성) 추가.

**검증**: `pnpm tsc --noEmit` 클린, `pnpm lint` 통과, `pnpm build` 51개 페이지 정적 생성 성공, `pnpm test` 53/53 통과.

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/main...develop
