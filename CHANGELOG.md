# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Dependencies

- `clsx` (prod) — 조건부 className 결합.
- `tailwind-merge` (prod) — 충돌 Tailwind 유틸 뒤쪽 우선 해결.
- `lucide-react` (prod) — 단일화된 아이콘 라이브러리.
- `radix-ui` (prod) — shadcn `Sheet`가 사용하는 Radix Dialog 메타 패키지.
- `tw-animate-css` (prod) — shadcn `Sheet`의 `animate-in`/`slide-in-from-*`/`fade-out-0` 등 Tailwind 4 호환 애니메이션 유틸 제공.

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/main...develop
