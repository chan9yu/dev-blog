# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

🚀 **SEO 정합성 강화 + 실험 항목 정리** — velog 벤치마크 후 진짜 효과 있는 baseline만 유지. 사용자 요청 "모든 아티클이 Google 첫 페이지"를 위한 **시스템화**(회귀 자동 차단)에 집중하고, Google이 rich result 자격을 축소했거나 효과 미검증인 항목은 도입 보류 (회고는 `.claude/rules/seo.md` 하단).

### Added

- **빌드 타임 frontmatter SEO 검증** (`scripts/validate-frontmatter-seo.mjs`) — title ≤60자, description 120~160자, slug 영문 강제, slug↔디렉토리명 정합 검증. `prebuild`에 통합되어 위반 시 `pnpm build` 자동 실패. **신규 포스트 발행 시 SEO 회귀 자동 차단** — 사용자 요청 "모든 아티클" baseline 강제 메커니즘. 가장 결정적인 변경.
- **`docs/SEO_EXTERNAL.md`** — 코드로 해결 못 하는 외부 SEO 작업 체크리스트. Google Search Console·Bing Webmaster·Naver Search Advisor 등록, dev.to/Medium/Hashnode canonical 유지 크로스 포스팅, Otterly·Peec·ZipTie AI visibility 모니터링, news.hada/Disquiet/OKKY/Hacker News/Lobste.rs 공유 가이드, 위키피디아 인용 전략. velog 같은 platform 도메인 권위 추격은 코드 외 작업이 결정적.
- **`pnpm validate:seo` 스크립트** — 빌드 없이 frontmatter SEO만 검증.
- **SEO 보조 스킬 3종 등록** (`.claude/skills/{ai-seo,programmatic-seo,seo-audit}`) — 일반 SEO 컨설팅 지식(AI 검색·programmatic SEO 패턴·SERP audit 절차)을 보조 스킬로 분리. dev-blog 도메인 baseline은 `.claude/rules/seo.md` 단일 진실 공급원 유지하되, 필요 시 보조 참조 가능. (스킬 카운트 12 → 15)

### Changed

- **frontmatter description 일괄 정합화 (11개 포스트)** — `mqtt-protocol-overview`(26→141자, 가장 시급), `webrtc-deepdive-02`·`03`·`04`, `2025-retrospective`, `goormthon-13th-jeju-retrospective`, `hanghae-plus-wil10`, `harness-engineering-thoughts`, `separating-react-app-to-sdk` 모두 120~160자 범위로 보강. 검색 스니펫 잘림 방지 + 본문 자동 추출 차단(메타 통제권 회복).
- **BlogPosting JSON-LD `dateModified` + article OG `modified_time` 정합** — `posts/[slug]/page.tsx`에서 `frontmatter.updated`를 `buildBlogPostingJsonLd.modified`와 `buildMetadata.modifiedAt`에 동시 전달. sitemap `lastmod`(이미 정합)와 시그널 통일.

### Removed

- **실험적 SEO 인프라 일괄 정리** — 동일 사이클 안에서 추가했다가 효과 검증 부족·Google rich result 자격 축소로 모두 제거:
  - `/llms.txt` 라우트 (`src/app/llms.txt/route.ts`) — llmstxt.org 표준 제안이지만 ChatGPT/Claude/Perplexity 공식 활용 발표 X. YAGNI.
  - robots.txt AI 크롤러 11종 명시 Allow → wildcard `User-Agent: *`만 유지. "명시가 인용 시그널"이라는 주장 검증 안 됨.
  - `FAQPage` JSON-LD 빌더 + frontmatter `faq[]` optional 필드 — 2023년 9월 Google이 rich result 자격을 정부·건강 사이트로 축소. 일반 블로그 SERP 효과 없음.
  - `HowTo` JSON-LD 빌더 + frontmatter `howTo` optional 필드 — 동일. mobile 사실상 미노출.
  - `Organization` JSON-LD (root layout) — Google은 1인 사이트에 `Person`만 권장. Organization은 회사 entity 신호.
  - `CreativeWorkSeries` JSON-LD (시리즈 상세) — schema.org 정식이지만 Google이 적극 활용한다는 증거 약함. velog 등 대형 platform도 미사용.
  - dead config: `src/shared/config/site.ts`의 `siteMetadata.ogImage` (사용처 0건, GC 발견) 삭제.
- **결과**: schema.org JSON-LD 4종(WebSite·Person·BlogPosting·BreadcrumbList)으로 정착. 코드량 ~250줄 감소.

### Notes

- **velog 분석 결과**: velog의 head는 매우 미니멀합니다 (`<title>velog</title>`, description 1개, `og:image` 정적 1개, JSON-LD 0종, Twitter Card 누락, `/sitemap.xml` 404). 도메인 권위(DA 70+)가 압도적이라 기술 SEO에 덜 의존. **우리는 이미 기술 SEO에서 velog를 앞섭니다** — 진짜 갭은 (1) 도메인 권위, (2) 외부 백링크, (3) 콘텐츠 깊이. 코드로 해결 불가.
- **회고 — 왜 추가했다가 빼는가**: 사용자 솔직 평가 요청에 따라 2026년 5월 기준 실효성 재검토. "코드 SEO baseline 상한선"을 넘긴 항목들은 유지보수 비용만 누적. `.claude/rules/seo.md` "회고 — 도입 보류한 항목" 섹션에 결정 근거 명문화. 미래에 효과 입증 시 재도입 가능.
- **남은 핵심 가치**: (1) 빌드 게이트 — 모든 신규 포스트 SEO 회귀 자동 차단 (시스템화), (2) JSON-LD 4종 — 표준 baseline, (3) frontmatter description 정합화 — 검색 스니펫 통제, (4) `SEO_EXTERNAL.md` — 코드로 못 하는 외부 작업 가이드.
- **다음 우선순위 — 콘텐츠 자체**: WebRTC 시리즈 본문 보강(첫 단락 키워드, 시리즈 내부 링크, Featured Snippet 대상 자연어 heading). 새 대화에서 `content-engineer 에이전트로 WebRTC 시리즈 본문 보강 진행해줘`. 그리고 외부 백링크 작업(`docs/SEO_EXTERNAL.md` § 3) — ROI가 코드보다 훨씬 높음.

## [1.1.4] - 2026-05-04

🚑 **production hotfix — 댓글 표시 회귀·React #418 잔재·Header sticky·배포 버전 가시화 + 자동 release workflow** — v1.1.3 production 검증에서 발견한 3개 회귀와 사용자 요청 2건을 묶은 hotfix release. Playwright MCP로 production 직접 검증한 결과를 즉시 정정.

### Fixed

- **Giscus 댓글 표시 회귀 ([#30](https://github.com/chan9yu/dev-blog/issues/30))** — `CommentsSection.tsx:80`의 `data-term`이 `${slug}` 형식이지만 GitHub Discussion title은 `posts/${slug}` 형식으로 자동 생성되어 mapping="specific" 매칭 실패. 모든 23개 포스트 페이지에서 `Discussion not found` 404 + 빈 댓글 영역. `data-term`을 `posts/${slug}`로 정정해 기존 5개 discussion(#13·#14·#15·#17 등)과 즉시 매칭. 회귀 테스트 assertion 동시 갱신.
- **`/posts` React #418 hydration mismatch 잔재** — v1.1.3에서 `PostList`는 `useHydrated`로 게이팅했으나 동일 hook(`useViewMode`)을 쓰는 `ViewToggle`이 누락되어 server snapshot "list" vs client localStorage "grid" 불일치 시 `aria-pressed`·`className` 텍스트 mismatch 재발생. `ViewToggle`에도 `useHydrated` 게이팅 적용해 incomplete fix 보완.
- **Header sticky 회귀** — `Header.tsx:21`의 className이 `relative top-0`(의미 없는 조합)이어서 스크롤 시 헤더가 같이 흘러감. `sticky top-0`로 정정. layout.tsx의 Suspense fallback(`sticky top-0 z-40 h-16`)과 마크업 정합 복원.

### Added

- **Footer에 배포 버전 UI** — `package.json` version을 `src/shared/config/site.ts`의 `APP_VERSION`으로 export(JSON import는 ES2025 표준 `with { type: "json" }` 구문 사용), Footer 카피라이트 옆에 `v{APP_VERSION}` 작은 링크로 표시. GitHub Release tag(`/releases/tag/v{version}`)로 직접 연결되어 배포된 빌드의 버전과 release notes를 즉시 확인 가능. 사용자 명시 요청.
- **자동 GitHub Release workflow** (`.github/workflows/release.yaml`) — `v*.*.*` tag push 시 CHANGELOG의 해당 버전 섹션을 awk로 추출해 `gh release create`로 자동 publish. 다음 release부터 수동 `gh release create` 단계 제거. 사용자 명시 요청.

### Notes

- 본 hotfix는 v1.1.3 production 검증(Playwright MCP) 사이클에서 사용자 직접 신고로 발견. v1.1.3의 회귀 가드에 "댓글 iframe 응답 200/404"와 "ViewToggle hydration" 항목이 누락되어 통과시킨 케이스. 다음 회귀 가드에 두 항목 추가.
- v1.1.3 GitHub Release notes의 "PostList 첫 카드 priority preload hint 정리"는 효과 유지. ViewToggle hydration fix는 그 보완 (PostList + ViewToggle 둘 다 동일 hook 사용).
- 추가 production Playwright 검증: `/`, `/series`, `/tags`, `/tags/뉴스봇`, `/about`, `/posts/react-set-state-in-effect`, `/sitemap.xml`, `/rss`, `/og`, `/robots.txt`, `/api/views` 모두 console 0 errors / 0 warnings + 정상 응답.

## [1.1.3] - 2026-05-04

🎯 **v1.1.2 후속 정리 + Next.js 16 best practice audit + a11y Tier 2 개선** — v1.1.2 Notes에서 격리 약속한 `/api/views` 500 본질 fix와 React #418 hydration mismatch 본질 fix, search-index pre-bake over-engineering 제거, sitemap·a11y·SEO 정합성 보강을 묶어 release. 100건 이상 라우트·인터랙티브 시나리오 Playwright MCP E2E 검증 통과 (console 0 errors / 0 warnings).

### Fixed

- **`/api/views` 500 본질 fix** — `@vercel/kv` lazy 초기화가 환경변수 누락 시 _sync_ throw하는 패턴을 `isKvConfigured` 가드 + try/catch로 흡수. KV 미설정 환경에서 GET 200 + `views=0`, POST 204 응답으로 fail-soft. 이전 `.catch()`는 promise rejection만 잡아 sync throw 우회 불가했음.
- **React #418 hydration mismatch (`/posts` localStorage="grid" 시나리오)** — `useViewMode`처럼 server snapshot(false)과 client snapshot(localStorage 값)이 다른 hook을 직접 className에 사용해 mismatch 발생. `set-state-in-effect` 룰을 위반하지 않는 `useHydrated` 훅(`useSyncExternalStore` 기반: server=false, client=true)으로 일관 게이팅하여 mismatch 0건.
- **PostList 첫 카드 priority preload hint** — view-mode 전환 시 list/grid sizes 불일치로 `_next/image was preloaded but not used` 워닝 발생. `RecentPostsList`의 동일 회피 패턴(라인 65 주석)과 정렬해 priority 제거, framer-motion 우회로 paint timing 안정화만 유지.

### Added

- **`useHydrated` 공유 훅 (`src/shared/hooks/useHydrated.ts`)** — `useSyncExternalStore`로 server/client first hydration 일치를 보장. `useTheme`·`PageTransition`·`PostList`의 인라인 `useState + useEffect(() => setMounted(true), [])` 중복(`set-state-in-effect` 룰 위반)을 한 곳으로 통합.
- **PostFrontmatter `updated?: string` optional 필드** — Zod schema에 ISO 8601 regex 추가. sitemap `lastmod`가 `frontmatter.updated ?? frontmatter.date`를 사용하도록 정렬 (seo.md §Sitemap 룰 정합).
- **`.claude/rules/comments.md` 신규 룰** — "No comments by default" + Why-over-What + 4가지 허용 케이스(비명시적 제약·subtle invariant·workaround·회귀 차단) 명문화. AI 협업 코드의 과도 주석 회귀 차단.
- **`react.md`에 Hydration mismatch / mounted gate 패턴 절** — `set-state-in-effect` 위반 anti-pattern + `useHydrated` 권장 패턴 명문화.

### Changed

- **a11y Tier 2 개선 (WAI-ARIA APG 정합)**
  - `MdxImage`: `useId()`로 figcaption `id` 발급 + button `aria-describedby` 연결 (스크린 리더 캡션 정밀 안내).
  - `ViewToggle`: `role="group"` → `role="toolbar"` + `aria-label="뷰 모드"` (toolbar pattern). `aria-pressed` 정상 전이.
  - `SearchModal`: sr-only `role="status" aria-live="polite" aria-atomic="true"` 항상 mount, 검색 상태("검색 중"/"검색 결과 없음"/"검색 결과 N개") 동적 안내.
  - `CommentsSection`: lazy 안내에 `role="status" aria-live="polite"` 적용.
- **`/og` 라우트** — `export const dynamic = "force-dynamic"` 명시 (Next.js 16 type checking 정합 + searchParams 동적 의도 표현).
- **홈 라우트 ISR 명시** — `app/page.tsx`에 `export const revalidate = 3600` (1시간 갱신) 명시.
- **`/manifest.webmanifest`** — `MetadataRoute.Manifest` 타입 명시 (Next.js 16 strict 정합).
- **`/tags/[tag]` page** — `generateMetadata` + Page가 동일 `getPostsByTag` 결과를 React `cache()`로 공유 (lookup dedupe, `series/[slug]` 패턴과 일관).
- **하네스 자산 카운트 갱신**: 16개 → 17개 규칙 (CLAUDE.md, README.md, AI_WORKFLOW_GUIDE.md 동기화).

### Removed

- **`scripts/build-search-index.mjs` + `src/shared/data/search-index.json` pre-bake 접근 제거** — v1.1.2의 fail-soft 보강책으로 도입했으나, `cacheComponents: false`로 SSG-first가 정착된 시점에는 `getPublicPosts()`가 빌드 타임에만 호출되므로 runtime fs 의존이 원천적으로 없음. 빌드 단계 추가·`.gitignore`·CI step·prebuild script 모두 over-engineering으로 판단되어 제거 (사용자 지시: "심플하게 가자고"). `app/layout.tsx`는 `getPublicPosts()` 직접 호출로 회귀.

### Notes

- **검증 baseline**: `pnpm type:check` PASS, `pnpm lint` PASS, `pnpm test` 250/250 PASS, `pnpm build` 97 정적 페이지 0 warnings, `.next/server` 48MB (Vercel 250MB 한계 대비 안전), Lambda nft.json contents/images 0건 trace.
- **Playwright MCP E2E** (port 3110): 17개 라우트(홈·posts·series·tags·about·sitemap·rss·robots·og·manifest·404 한글 slug 포함) + 6개 인터랙티브(⌘K 검색·다크모드·모바일 메뉴·ViewToggle·SPA navigation) 모두 console 0 errors / 0 warnings. v1.1.0~v1.1.2 회귀 패턴 5종(streaming stuck·React #418·/api/views 500·images over-tracing·lambda size) 0건 재현.
- **자율 영역만 처리** — 10개 포스트 frontmatter description 120-160자 확장(seo.md 룰)은 contents/ 사용자 승인 영역으로 v1.1.3에서 보류.

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
