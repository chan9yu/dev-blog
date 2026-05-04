# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2026-05-04

🚑 **프로덕션 streaming stuck 핫픽스 (root cause fix)** — v1.1.0 production 직후 ~30분 시점부터 시작된 무한 `loading.tsx` stuck을 **본질적으로 해결**. v1.1.1의 `outputFileTracingIncludes` fix로는 부족했던 진짜 root cause는 `cacheComponents: true`(Next.js 16 PPR)가 모든 RSC를 default dynamic으로 만들어 매 요청 `fs.readdirSync(contents/)` 호출 → Vercel lambda contents/ 부재 시 ENOENT throw → streaming chunk close → 모든 dynamic 라우트(`/`, `/posts`, `/series`, `/tags`, `/posts/[slug]`, `/sitemap.xml`, `/og`) stuck.

### Fixed

- **`cacheComponents: false`** — SSG-first 블로그(PRD G-1)에 ISR/dynamic이 불필요. PPR 비활성화로 Next.js가 모든 페이지를 빌드 타임에 정적 prerender → runtime contents/ 의존 0%. v1.1.0~v1.1.1에서 잘못 적용된 PPR 모드를 정정.
- **검색 인덱스 빌드 타임 pre-bake** — `scripts/build-search-index.mjs`가 `contents/posts/*` MDX를 스캔해 `src/shared/data/search-index.json` (gitignore) 정적 emit. `prebuild`에 포함. `app/layout.tsx`는 이 JSON을 정적 import → runtime `fs.readdirSync` 호출 제거.
- **로컬 production 시뮬레이션 검증** — `pnpm build && pnpm start -p 3100` 환경에서 `contents/`를 일시 제거 후 `/`, `/posts`, `/series`, `/tags`, `/about`, `/sitemap.xml`, `/api/views`, `/og` 모두 fetch → ENOENT throw 0건, Suspense pending 0건 확인.

### Added

- **`.claude/rules/no-fallback.md` 신규 룰** — try/catch + 빈 값 반환·임시 플래그·setTimeout 우회 같은 fallback/workaround 안티패턴을 거부하고 본질 fix로 가이드. v1.1.1에서 잘못 시도한 fail-soft 회피책 패턴이 이 룰의 회고 사례.
- **하네스 자산 카운트 갱신**: 15개 → 16개 규칙 (CLAUDE.md, README.md, AI_WORKFLOW_GUIDE.md 동기화).

### Changed

- **`outputFileTracingExcludes` 단순화** — `cacheComponents: false`로 runtime fs 의존이 사라지므로 `contents/**/images/**`만 명시적 제외(155MB lambda 사이즈 절감), include 패턴은 빌드 정적 자원만 trace로 자동 포함되도록 위임.

### Notes

- v1.1.1의 lambda tracing fix(`outputFileTracingIncludes`)는 trace에 MDX는 포함했으나 `cacheComponents: true` 모드의 dynamic RSC 자체는 막지 못해 stuck 지속. v1.1.2의 PPR 비활성화가 진짜 fix.
- `/api/views` 500은 별개 fault(KV sync throw 미흡수). 본 핫픽스 범위 외, 후속 v1.1.3로 격리 처리 예정.

## [1.1.1] - 2026-05-04

🚑 **프로덕션 streaming stuck 핫픽스** — v1.1.0 배포 후 ~30분 시점부터 모든 dynamic 라우트(`/`, `/posts`, `/series`, `/tags`, `/posts/[slug]`)가 `loading.tsx` fallback에서 영구 stuck. 즉시 회복.

### Fixed

- **`next.config.ts` lambda file tracing** — `outputFileTracingExcludes`가 `contents/**/*` 전체를 lambda에서 제외했으나, `app/layout.tsx`의 `getPublicPosts()`가 매 요청마다 `readdirSync(contents/posts)` + `readFileSync(*.mdx)`를 호출 (검색 인덱스 빌드 목적). `cacheComponents`(PPR) layout 캐시 만료 시 runtime fallback이 발생하면서 `ENOENT` throw → streaming chunk close → 모든 dynamic 페이지 영구 stuck.
- **해결**: `outputFileTracingIncludes`로 `contents/posts/**/*.mdx` + `contents/about/**/*` 명시 포함. `outputFileTracingExcludes`는 `contents/**/images/**`로 좁힘 — images만 제외 (155MB), MDX 텍스트(576KB)는 lambda에 포함. `readdirSync`는 dynamic fs라 trace heuristic이 자식 파일을 자동 포함하지 못하므로 explicit include로 안전판 강화.
- **검증**: 로컬 `pnpm build` lambda trace에 `contents/posts/**/*.mdx` 24개 포함, image 0개 확인. lambda 사이즈 영향 +576KB (300MB 한계 대비 충분).

### Added

- **GitHub Actions CI** (`.github/workflows/ci.yaml`) — PR/push to develop·main 트리거, Typecheck + Vitest 단일 job, 10min timeout. private contents 서브모듈 access는 `REPO_CLONE_TOKEN` PAT 사용.
- **PR 템플릿** (`.github/PULL_REQUEST_TEMPLATE.md`) — `workflow.md`의 PR 형식을 GitHub 표준 위치로 분리. `gh pr create` UI 호출 시 자동 prepopulate.
- **`type:check` npm 스크립트** — `tsc --noEmit` (workflow.md PR 템플릿이 이미 참조하던 명령과 정합).

### Changed

- **README v1.1.0 production 정합** — "예정 도입 (M2+)" 섹션 제거 (Vitest·Playwright·Vercel KV·Zod 모두 v1.1.0에 포함되어 있으므로). Stack에 Turbopack·Shiki·Zod·Testing 명시. 배포 섹션에 `chan9yu.dev` 링크 + `KV_REST_API_URL`/`KV_REST_API_TOKEN` 정확한 env 이름 명시. Release 배지 추가.
- **Vercel MCP 통합** (이전 commit `b13e26d`) — 읽기 전용 호출(`get_deployment`·`list_deployments`·`get_deployment_build_logs`·`get_runtime_logs`·`get_project`·`list_projects`·`search_vercel_documentation`) 자율 범주 등록. 쓰기 명령(`deploy_to_vercel` 등)은 사용자 승인 필수.

### Notes

- **`/api/views` 500은 별개 fault** — `@vercel/kv`가 환경변수 누락 시 sync throw하는데 route handler의 `.catch()`는 promise rejection만 catch. 본 핫픽스 범위 외 — 후속 작업으로 환경변수 점검 + sync throw 방어 코드 추가 예정.

## [1.1.0] - 2026-05-04

🎉 **첫 Production 배포** — Next.js 16 App Router 기반 SSG-first 1인 저자 기술 블로그. M0~M7 8개 마일스톤(약 130 태스크) 완료, main 브랜치 머지로 Vercel 자동 배포 + `v1.1.0` 태깅.

### Added — Reader-facing 기능

- **콘텐츠 파이프라인** — MDX 포스트(Git Submodule), Shiki 듀얼 테마 코드 하이라이팅, 자동 TOC, 인접/관련 포스트 네비, 읽기 진행률 인디케이터.
- **검색** — `Cmd/Ctrl+K` 모달 + Fuse.js 클라이언트 인덱스 + 인기 태그·최근 포스트 추천(빈 입력 상태) + 키보드 네비게이션.
- **시리즈·태그 허브** — 9개 도메인 모듈로 분리. **한글 slug 영역별 정책** 채택 — 포스트 영문 강제, 태그·시리즈 한글 허용 + 공백 hyphen 정규화 (외부 링크 안전성 + 검색 호환성).
- **조회수** — Vercel KV 기반 + 빌드 안전 fallback (KV 미설정 환경에서도 빌드·렌더 OK).
- **댓글** — Giscus 지연 마운트 (DIY 로더, 첫 페인트 영향 최소).
- **이미지 라이트박스** — Radix Dialog 기반, MDX 이미지 클릭 시 확대 + 키보드/오버레이 닫기.
- **다크/라이트 테마** — `next-themes` + View Transitions API 부드러운 전환 + `useSyncExternalStore` 하이드레이션 안전 (FOUC 방지).
- **모바일 메뉴** — Drawer 기반, 링크 클릭 시 자동 닫기 + body scroll lock.

### Added — SEO·Syndication·A11y

- **메타데이터 표준화** — 모든 페이지 `generateMetadata`, OpenGraph article/website 분기, Twitter `summary_large_image`.
- **Structured Data** — `WebSite` · `BlogPosting` · `BreadcrumbList` · `Person` JSON-LD 4종 (XSS-safe `<` escape).
- **Syndication** — `sitemap.xml`, `RSS feed`, `robots.txt` 자동 생성. `lastmod`은 frontmatter `updated || date` 기준.
- **OG 동적 생성** — `/og` Edge Route, 1200×630, Pretendard Variable 폰트 임베딩.
- **WCAG 2.1 AA** — Skip link(`#main-content`), focus trap, 시맨틱 HTML, axe **0 critical**.

### Performance — Core Web Vitals 통과

- **LCP < 2.5s · CLS < 0.1 · INP < 200ms · Lighthouse Performance ≥ 95** (NFR-001~004 충족).
- `next/image` + 모바일 PostCard `priority={index === 0}` 정밀화.
- `next/font` self-host (Pretendard Variable, `display: swap`).
- React Compiler 활성, Turbopack 기본 빌드.

### Architecture — 1인 저자 SSG-first

- **3-Layer**: `app/` (라우팅·조립) → `features/` (9개 도메인) → `shared/` (범용). 단방향 의존, feature 간 cross-import 금지.
- **9개 feature**: posts · tags · series · search · views · comments · theme · lightbox · about. 각 feature는 `index.ts` Public API로만 외부와 연결.
- **SSG-first**: 콘텐츠 페이지 빌드 타임 정적 생성. 런타임 CMS·서버 검색·클라이언트 캐시(TanStack/SWR) 미도입(YAGNI).
- **유일한 런타임 API**: `/api/views` (Vercel KV) — fail 시 `0` fallback.

### Tooling — TDD + 컴파운드 엔지니어링 하네스

- **테스트 전략**: Testing Trophy(Integration ~60%) + Vitest + RTL + MSW + Playwright E2E 5 spec(홈·검색·테마·TOC·모바일 메뉴).
- **CI/CD**: GitHub Actions(`ci.yaml`) — typecheck/lint/build/Vitest/Playwright. PR 생성 시 Vercel Preview, main 머지 시 Production 자동 배포.
- **Pre-commit**: lefthook + Prettier + ESLint + tsc.
- **컴파운드 엔지니어링 하네스**: 15 agents · 12 skills · 15 rules — `PLAN→EXECUTE→REVIEW(핑퐁 3회)→VALIDATE→DOCUMENT→SYNTHESIZE` 자율 사이클. `blog-dev` 오케스트레이터가 자연어 요청을 4 트랙(Feature/Content/GC/Docs)으로 자동 분류.
- **Pre-merge E2E adversarial**: Playwright MCP 기반 15 stories(검색 한글 입력·테마 stress·라이트박스·skip link·404·한글 slug·다중 viewport·race condition·network failure)에서 **0 release blocker** 확인.

### Decided — 정책 결정 (ADR)

- **ADR-007**: KV 미설정 환경에서 빌드 안전 fallback (조회수 0 또는 silent skip).
- **ADR-009**: Page-First Skeleton — M1에서 fixture로 전 페이지 UI 완성 후 단계적 실데이터 교체.
- **ADR-013**: TDD + Testing Trophy 채택.
- **한글 slug 정책 (2026-05-03)**: 포스트는 영문 강제(도구·CDN 호환), 태그·시리즈는 한글 허용 + 공백→hyphen 정규화 (RFC 3986 sub-delim 회피).

### Notes

- 본 release 이전의 **마일스톤별 incremental 변경 로그**는 다음 위치에서 참조 가능:
  - `docs/ROADMAP.md` — 마일스톤·태스크별 Entry/Exit 기준
  - `docs/TASKS.md` — 태스크 체크박스 진행 이력
  - `git log --oneline` — 모든 commit 이력
- 첫 production tag을 `v1.1.0`으로 채택. M0~M7 누적 변경량과 "완전 리팩토링 후 첫 안정 릴리스" 의미 반영 (사용자 결정).

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.2
[1.1.1]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.1
[1.1.0]: https://github.com/chan9yu/dev-blog/releases/tag/v1.1.0
