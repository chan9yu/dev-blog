# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

홈 페이지의 Hero·최근 포스트·사이드바(Popular Posts·Trending Series·Trending Tags)를 더미 fixture 기반으로 완성. 레거시 `.existing_version/src/app/page.tsx` UX를 현 프로젝트 토큰·규약(shadcn alias·Tailwind 4 표준)으로 번역.

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

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/main...develop
