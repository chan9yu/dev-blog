# chan9yu 개발 블로그 -- 개발 로드맵

## 개요

- **프로젝트**: chan9yu 개발 블로그 -- 한국어권 프론트엔드 엔지니어를 위한 1인 저자 기술 블로그
- **PRD 버전**: Product PRD v0.3.0 / Engineering PRD v0.4.0
- **최종 업데이트**: 2026-04-12
- **핵심 목표**: 깊이 있는 기술 기록, 시리즈 중심 학습 경로, 빠르고 접근성 좋은 독서 경험

### 개발 철학 -- Page-First Skeleton

> 모든 페이지의 껍데기를 먼저 만든다.

M1에서 더미 데이터(fixture)로 전 페이지 UI를 완성한 뒤, M2 이후 실데이터로 단계적 교체한다. fixture는 `src/shared/fixtures/`에 격리하고, M2 진입 시 순차 제거한다. (`ADR-009`)

### 현재 상태

**M5 SEO & Syndication -- 완료**. M0~M5 전 마일스톤 완료. `shared/seo/` 모듈(buildMetadata·JSON-LD 빌더·JsonLdScript) + 전 라우트 generateMetadata + 동적 sitemap/RSS/robots 구현 완료. M6 A11y & Perf 대기 중.

---

## 마일스톤 요약

| Milestone                  | 목표                                                         | 예상 기간 | 상태     |
| -------------------------- | ------------------------------------------------------------ | --------- | -------- |
| **M0** Foundation          | 빌드 쉘, 디자인 토큰, 공통 레이아웃, 전 라우트 빈 페이지     | 1주       | **완료** |
| **M1** UI Skeleton         | 더미 데이터로 전 페이지 UI 완성                              | 2~3주     | **완료** |
| **M2** Content Pipeline    | Submodule, MDX 파서, 읽기 시간, 실데이터 교체, TDD 시작      | 1~2주     | **완료** |
| **M3** Feature Wiring      | Search, Views KV, Comments, Theme persistence, Lightbox 연결 | 2주       | **완료** |
| **M4** Hubs & Aggregations | 태그/시리즈 집계, Popular 빌드 타임 스냅샷, 관련 포스트      | 1~2주     | **완료** |
| **M5** SEO & Syndication   | Metadata, JSON-LD, OG, Sitemap, RSS, Robots                  | 1주       | **완료** |
| **M6** A11y & Perf         | axe 0 critical, CWV green, 폰트 서브셋, 모션 토글            | 1주       | 대기     |
| **M7** Polish              | E2E 스모크, P2 검토, Production 배포                         | 지속      | 대기     |

---

## 기술 아키텍처 개요

```
Browser (Client)
  React 19 RSC (Streamed) + Client Islands (Search, Views, Lightbox, Theme)
       |
  Next.js 16 (App Router) -- SSG-first
       |
  src/app/         -- 라우팅, metadata, generateStaticParams
       |
  src/features/*   -- 9개 독립 모듈 (posts, tags, series, search, views, comments, theme, lightbox, about)
       |
  src/shared/*     -- 디자인 토큰, 레이아웃, MDX, 아이콘, SEO
       |
  contents/ (Git Submodule)    Vercel KV (views)    Giscus (comments)
```

**Tech Stack**: Next.js 16 + React 19 + TypeScript 6 + Tailwind CSS 4 + shadcn/ui + Vitest + Playwright

**3 Laws**: `app -> features -> shared` 단방향 의존. Feature 간 직접 import 금지. Shared는 Feature를 import 하지 않음.

---

## Phase별 상세 계획

---

### M0: Foundation

**진행 상태** (2026-04-13): **33/33 완료 (M0 Exit 기준 달성)**. 본 ROADMAP 작성 이후 결정이 변경된 부분:

- 디자인 토큰을 **CSS-only**로 통합 (TS `foundations/` 파일 폐기)
- 공통 레이아웃 컴포넌트 경로: `shared/components/layout/` → `shared/components/` **평탄화**
- M0-13 Drawer는 별도 구현 없이 **shadcn `Sheet` 직접 사용** (MobileMenu에서 `<Sheet.X>` 네임스페이스)
- M0-30 `not-found.tsx`·`loading.tsx` 완료, M0-31 `providers.tsx`(next-themes), M0-33 `site.ts`(siteMetadata + siteNav + siteSocials + getSiteUrl)
- 세부 체크 상태는 [`TASKS.md`](./TASKS.md)를 단일 출처로 사용. 본 문서의 체크박스는 참고용.

**목표**: 빌드 쉘, 디자인 토큰(light/dark), 공통 컴포넌트, 전 라우트(`RT-*`) 빈 페이지 렌더

**Entry 기준**: Next.js 16 프로젝트 초기 셋업 완료 (달성)

**Exit 기준**: `pnpm dev`에서 모든 `RT-*` 14종이 404 없이 빈 페이지로 렌더, CI 통과, ESLint/Prettier/Lefthook 작동, 디자인 토큰 light/dark 둘 다 렌더

**예상 기간**: 1주

#### 디자인 토큰 & 스타일 기반

- [x] **[M0-01]** Primitive/Semantic 색상 토큰 CSS 일원화 (`shared/styles/tokens.css`)
  - 대응: FEAT-THEME, MOD-theme
  - 검증: light/dark 양쪽 palette가 TS 상수로 정의됨

- [x] **[M0-02]** Typography 스케일 CSS-only (`shared/styles/globals.css` `@theme inline`, 10단계)
  - 대응: 전체 FEAT
  - 검증: Display/Heading/Body/Label 스케일이 TS 상수로 정의됨

- [x] **[M0-03]** Semantic CSS 변수 토큰 (`shared/styles/tokens.css`)
  - 대응: FEAT-THEME, ADR-011
  - 검증: `--color-text-primary` 등 semantic 변수가 `.dark` 셀렉터와 함께 정의됨

- [x] **[M0-04]** 기반 스타일 파일 구성 (`base.css`, `animations.css`, `prose.css`, `scrollbar.css`, `shiki.css`)
  - 대응: MOD-posts, MOD-theme
  - 검증: 글로벌 reset, 스크롤바 스타일, prose 스타일이 적용됨

- [x] **[M0-05]** Tailwind CSS 4 `@theme` 블록에 Semantic 토큰 연결
  - 대응: 전체 FEAT
  - 검증: `@theme` 블록에서 CSS 변수를 참조하여 Tailwind 유틸리티로 사용 가능

- [x] **[M0-06]** `cn()` 유틸리티 함수 구성 (`clsx` + `tailwind-merge`)
  - 대응: 전체 컴포넌트
  - 검증: `cn("px-4", condition && "bg-red")` 호출이 정상 동작

#### 폰트 & 아이콘

- [x] **[M0-07]** `next/font`로 Pretendard Variable 폰트 설정 (korean + latin 서브셋)
  - 대응: NFR-006
  - 검증: FOUT < 100ms, 한글/영문 모두 Pretendard로 렌더

- [x] **[M0-08]** `lucide-react` 설치 및 아이콘 사용 패턴 확립
  - 대응: FEAT-NAVIGATION, FEAT-READING-AIDS, FEAT-THEME
  - 검증: `import { Search, Moon, Sun } from "lucide-react"` 정상 렌더, tree-shaking 확인

#### 공통 레이아웃 컴포넌트

- [x] **[M0-09]** `Header.tsx` -- sticky 헤더, 로고(홈), 데스크톱 네비게이션 메뉴 슬롯
  - 대응: FEAT-NAVIGATION
  - 검증: 데스크톱에서 Posts/Tags/Series/About 링크, Search 아이콘, Theme 토글 슬롯 존재

- [x] **[M0-10]** `Footer.tsx` -- 저작권, RSS 아이콘, 소셜 링크, "맨 위로" 앵커
  - 대응: FEAT-NAVIGATION, FEAT-RSS
  - 검증: Footer 내 소셜 링크(GitHub/LinkedIn/X/Email)와 RSS 아이콘 렌더

- [x] **[M0-11]** `Container.tsx` -- 반응형 max-width 래퍼
  - 대응: 전체 페이지
  - 검증: 콘텐츠가 중앙 정렬, 반응형 padding 적용

- [x] **[M0-12]** `Sidebar.tsx` -- md 이상 우측 사이드바, md 미만 본문 아래 배치
  - 대응: FEAT-HOME
  - 검증: breakpoint에 따른 레이아웃 전환 정상

- [x] **[M0-13]** `MobileMenu.tsx` -- shadcn `Sheet` 직접 사용 (별도 Drawer wrapper 생략)
  - 대응: FEAT-NAVIGATION
  - 검증: 햄버거 클릭 시 드로어 슬라이드 인, body 스크롤 잠금, Esc로 닫기

- [x] **[M0-14]** `NavLink.tsx` -- 활성 경로 하이라이트 링크 컴포넌트
  - 대응: FEAT-NAVIGATION
  - 검증: 현재 경로와 일치하는 NavLink에 활성 스타일 적용

- [x] **[M0-15]** `SocialLinks.tsx` -- GitHub/LinkedIn/X/Email 소셜 링크 묶음
  - 대응: FEAT-ABOUT, FEAT-NAVIGATION
  - 검증: 아이콘 + 외부 링크로 새 탭 열림

#### 라우팅 쉘 (모든 RT-\*)

- [x] **[M0-16]** `RT-/` 홈 페이지 라우트 쉘 (`app/page.tsx`)
  - 대응: RT-/, FEAT-HOME
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-17]** `RT-/posts` 포스트 목록 라우트 쉘 (`app/posts/page.tsx`)
  - 대응: RT-/posts, FEAT-POSTS-LIST
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-18]** `RT-/posts/[slug]` 포스트 상세 라우트 쉘 (`app/posts/[slug]/page.tsx`)
  - 대응: RT-/posts/[slug], FEAT-POST-DETAIL
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-19]** `RT-/tags` 태그 허브 라우트 쉘 (`app/tags/page.tsx`)
  - 대응: RT-/tags, FEAT-TAGS-HUB
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-20]** `RT-/tags/[tag]` 태그 상세 라우트 쉘 (`app/tags/[tag]/page.tsx`)
  - 대응: RT-/tags/[tag], FEAT-TAG-DETAIL
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-21]** `RT-/series` 시리즈 허브 라우트 쉘 (`app/series/page.tsx`)
  - 대응: RT-/series, FEAT-SERIES-HUB
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-22]** `RT-/series/[slug]` 시리즈 상세 라우트 쉘 (`app/series/[slug]/page.tsx`)
  - 대응: RT-/series/[slug], FEAT-SERIES-DETAIL
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-23]** `RT-/about` About 페이지 라우트 쉘 (`app/about/page.tsx`)
  - 대응: RT-/about, FEAT-ABOUT
  - 검증: 404 없이 빈 페이지 렌더

- [x] **[M0-24]** `RT-/rss` Route Handler 쉘 (`app/rss/route.ts`)
  - 대응: RT-/rss, FEAT-RSS
  - 검증: GET 요청 시 빈 XML 응답 반환

- [x] **[M0-25]** `RT-/sitemap.xml` 쉘 (`app/sitemap.ts`)
  - 대응: RT-/sitemap.xml, FEAT-SITEMAP
  - 검증: sitemap 함수 export 존재

- [x] **[M0-26]** `RT-/robots.txt` 쉘 (`app/robots.ts`)
  - 대응: RT-/robots.txt
  - 검증: robots 함수 export 존재

- [x] **[M0-27]** `RT-/manifest.webmanifest` 쉘 (`app/manifest.ts`)
  - 대응: RT-/manifest.webmanifest
  - 검증: manifest 함수 export 존재

- [x] **[M0-28]** `RT-/og` OG 이미지 Edge Route Handler 쉘 (`app/og/route.tsx`)
  - 대응: RT-/og, FEAT-METADATA-OG, US-021
  - 검증: Edge runtime으로 설정, GET 요청 시 placeholder 응답

- [x] **[M0-29]** `RT-/api/views` Route Handler 쉘 (`app/api/views/route.ts`)
  - 대응: RT-/api/views, FEAT-VIEW-COUNTER, MOD-views
  - 검증: GET/POST 핸들러 export 존재

#### 인프라 & DX

- [x] **[M0-30]** `not-found.tsx`, `loading.tsx` 글로벌 fallback 페이지
  - 대응: 전체 라우트
  - 검증: 존재하지 않는 경로 접속 시 커스텀 404 렌더

- [x] **[M0-31]** `app/providers.tsx` -- ThemeProvider 루트 래핑 (`next-themes`)
  - 대응: FEAT-THEME, MOD-theme, ADR-011
  - 검증: `<ThemeProvider attribute="class" enableColorScheme={false} defaultTheme="system">` 설정 완료

- [x] **[M0-32]** tsconfig.json path alias 확인 (`@/app/*`, `@/features/*`, `@/shared/*`)
  - 대응: 3 Laws 아키텍처
  - 검증: alias import가 정상 resolve

- [x] **[M0-33]** `src/shared/config/site.ts` -- 사이트 전역 설정 상수 (사이트명, URL, 소셜 링크 등)
  - 대응: FEAT-NAVIGATION, FEAT-METADATA-OG, FEAT-ABOUT
  - 검증: 설정값이 Header/Footer/SEO에서 import 가능

---

### M1: UI Skeleton (All Pages)

**목표**: 더미 데이터(fixture)로 전 페이지 UI 완성 -- 홈부터 about까지 모든 화면의 레이아웃, 상호작용, 상태(빈/로딩/에러)를 네비게이션만으로 확인 가능

**Entry 기준**: M0 Exit 달성 (모든 RT-\* 빈 페이지 렌더, 디자인 토큰 light/dark 렌더, CI 통과)

**Exit 기준**: 더미 데이터 기준 모든 `FEAT-*`의 UI 요구사항이 통과, UX 흐름이 네비게이션만으로 완결, `src/shared/fixtures/`에 fixture 배열이 모여 있음

**예상 기간**: 2~3주

#### Fixture 데이터

- [ ] **[M1-01]** `src/shared/fixtures/posts.ts` -- 더미 PostSummary 배열 (12건 이상, thumbnail 있는/없는 혼합, private 포함)
  - 대응: US-001, US-002, FEAT-HOME, FEAT-POSTS-LIST, FEAT-POST-DETAIL
  - 검증: 타입이 `PostSummary`와 일치, thumbnail null/string 혼합, private true 포함

- [ ] **[M1-02]** `src/shared/fixtures/post-details.ts` -- 더미 PostDetail 배열 (TOC 항목, MDX 본문 포함)
  - 대응: US-002, FEAT-POST-DETAIL
  - 검증: `contentMdx`, `toc` 필드가 포함된 상세 데이터

- [ ] **[M1-03]** `src/shared/fixtures/tags.ts` -- 더미 TagCount 배열
  - 대응: US-011, FEAT-TAGS-HUB, FEAT-TAG-DETAIL, MOD-tags
  - 검증: tag/slug/count 필드가 올바른 타입

- [ ] **[M1-04]** `src/shared/fixtures/series.ts` -- 더미 Series 배열 (각 시리즈에 포스트 3~5편)
  - 대응: US-012, FEAT-SERIES-HUB, FEAT-SERIES-DETAIL, MOD-series
  - 검증: Series 타입과 일치, seriesOrder 오름차순 포스트 포함

- [ ] **[M1-05]** `src/shared/fixtures/trending.ts` -- 더미 TrendingSnapshot (Popular Posts 5건, Trending Series 3건, Trending Tags 10건)
  - 대응: US-016, FEAT-HOME, ADR-007
  - 검증: TrendingSnapshot 타입과 일치

#### Feature 모듈 뼈대 (Public API index.ts)

- [ ] **[M1-06]** `features/posts/index.ts` -- MOD-posts Public API 뼈대
  - 대응: MOD-posts
  - 검증: 컴포넌트/서비스/타입 export 존재 (더미 구현)

- [ ] **[M1-07]** `features/tags/index.ts` -- MOD-tags Public API 뼈대
  - 대응: MOD-tags
  - 검증: 컴포넌트/서비스/타입 export 존재

- [ ] **[M1-08]** `features/series/index.ts` -- MOD-series Public API 뼈대
  - 대응: MOD-series
  - 검증: 컴포넌트/서비스/타입 export 존재

- [ ] **[M1-09]** `features/search/index.ts` -- MOD-search Public API 뼈대
  - 대응: MOD-search
  - 검증: SearchButton, SearchModal, useSearchShortcut export 존재

- [ ] **[M1-10]** `features/views/index.ts` -- MOD-views Public API 뼈대
  - 대응: MOD-views
  - 검증: ViewCounter export 존재

- [ ] **[M1-11]** `features/comments/index.ts` -- MOD-comments Public API 뼈대
  - 대응: MOD-comments
  - 검증: CommentsSection export 존재

- [ ] **[M1-12]** `features/theme/index.ts` -- MOD-theme Public API 뼈대
  - 대응: MOD-theme
  - 검증: ThemeSwitcher, useTheme export 존재

- [ ] **[M1-13]** `features/lightbox/index.ts` -- MOD-lightbox Public API 뼈대
  - 대응: MOD-lightbox
  - 검증: ImageLightbox, LightboxProvider export 존재

- [ ] **[M1-14]** `features/about/index.ts` -- MOD-about Public API 뼈대
  - 대응: MOD-about
  - 검증: AboutProfile export 존재

#### 공통 타입 정의

- [ ] **[M1-15]** `shared/types/` -- 공용 타입 정의 (PostSummary, PostDetail, TocItem, Series, TagCount, AdjacentPosts, RelatedPost, TrendingSnapshot 등)
  - 대응: 전체 MOD-\*
  - 검증: 모든 feature에서 import 가능한 공용 타입

#### 홈 페이지 (FEAT-HOME)

- [ ] **[M1-16]** Hero 섹션 -- 저자 소개 1~2줄, 프로필 이미지, CTA ("최신 글 보기")
  - 대응: FEAT-HOME, US-001
  - 검증: Hero가 렌더되고 CTA 클릭 시 `/posts`로 이동

- [ ] **[M1-17]** 최근 포스트 카드 섹션 -- 더미 PostCard 6장 (thumbnail 있는/없는 혼합)
  - 대응: FEAT-HOME, US-001
  - 검증: 카드 6장이 날짜 내림차순으로 표시, 16:9 thumbnail 또는 텍스트 카드

- [ ] **[M1-18]** 사이드바 Popular Posts 위젯 -- 더미 5건
  - 대응: FEAT-HOME, US-016, ADR-007
  - 검증: Popular Posts 위젯에 5건이 조회수 순으로 표시

- [ ] **[M1-19]** 사이드바 Trending Series 위젯 -- 더미 3건
  - 대응: FEAT-HOME, US-016, ADR-007
  - 검증: 시리즈 카드 3건이 포스트 수 순으로 표시

- [ ] **[M1-20]** 사이드바 Trending Tags 위젯 -- 더미 10건
  - 대응: FEAT-HOME, US-016, ADR-007
  - 검증: 태그 칩 10건이 포스트 수 순으로 표시

- [ ] **[M1-21]** 홈 반응형 레이아웃 -- md 이상 2-column, md 미만 1-column (사이드바 아래)
  - 대응: FEAT-HOME
  - 검증: breakpoint 전환 시 레이아웃 변경 확인

#### 포스트 목록 (FEAT-POSTS-LIST)

- [ ] **[M1-22]** `PostCard.tsx` -- 썸네일 이미지/텍스트 전용 카드 (제목, 설명, 태그 chip, 날짜)
  - 대응: FEAT-POSTS-LIST, US-001
  - 검증: thumbnail 유무에 따른 카드 레이아웃 분기, 태그 chip 노출

- [ ] **[M1-23]** `PostList.tsx` -- 포스트 카드 그리드/리스트 뷰 렌더
  - 대응: FEAT-POSTS-LIST, US-001
  - 검증: 더미 데이터로 카드 목록 렌더

- [ ] **[M1-24]** 뷰 토글 (그리드/리스트) -- localStorage에 선택 상태 저장
  - 대응: FEAT-POSTS-LIST
  - 검증: 그리드/리스트 아이콘 토글, 새로고침 후 상태 복원

- [ ] **[M1-25]** 태그 필터 패널 -- 좌측(데스크톱)/상단 chip(모바일), "전체" 리셋 버튼
  - 대응: FEAT-POSTS-LIST, US-001
  - 검증: 태그 클릭 시 필터링, 활성 태그 하이라이트, "전체" 리셋

- [ ] **[M1-26]** 무한 스크롤 -- 초기 12장, 스크롤 도달 시 12장 추가
  - 대응: FEAT-POSTS-LIST
  - 검증: 스크롤 하단 도달 시 추가 카드 로드

- [ ] **[M1-27]** 빈 상태/Suspense fallback -- "포스트가 아직 없어요" 메시지, 카드 스켈레톤 6장
  - 대응: FEAT-POSTS-LIST
  - 검증: 필터 결과 0건일 때 빈 상태 메시지, 로딩 시 스켈레톤

#### 포스트 상세 (FEAT-POST-DETAIL)

- [ ] **[M1-28]** 메타 헤더 -- 제목(h1), 설명, 발행일, 읽기 시간, 태그 chip, 조회수 placeholder
  - 대응: FEAT-POST-DETAIL, US-002, US-008, US-013
  - 검증: 더미 데이터로 모든 메타 필드 표시

- [ ] **[M1-29]** `ReadingProgress.tsx` -- 상단 2px 프로그레스 바 (GPU scaleX)
  - 대응: FEAT-READING-AIDS, US-002
  - 검증: 스크롤에 따라 프로그레스 바 진행, 본문 < 800자일 때 숨김

- [ ] **[M1-30]** `Toc.tsx` -- lg 이상 좌측 sticky TOC, lg 미만 상단 접힘 Accordion
  - 대응: FEAT-POST-DETAIL, FEAT-READING-AIDS, US-002
  - 검증: TOC 항목 클릭 시 앵커 스크롤, URL hash 반영, 반응형 전환

- [ ] **[M1-31]** MDX 본문 렌더 영역 -- prose 스타일 적용된 placeholder 콘텐츠
  - 대응: FEAT-POST-DETAIL, US-002
  - 검증: 코드 블록, 이미지, 제목이 포함된 더미 본문 렌더

- [ ] **[M1-32]** `MdxHeading.tsx` -- 자동 id 생성, 앵커 링크(#) 노출
  - 대응: FEAT-POST-DETAIL
  - 검증: h2/h3에 hover 시 앵커 아이콘 표시

- [ ] **[M1-33]** `ShikiCodeBlock.tsx` / `MdxPre.tsx` -- 코드 블록 + 복사 버튼 (2초 "Copied!" 피드백)
  - 대응: FEAT-POST-DETAIL, US-002
  - 검증: 복사 아이콘 클릭 시 클립보드 복사, 피드백 표시

- [ ] **[M1-34]** `MdxImage.tsx` -- 이미지 컴포넌트 (클릭 시 Lightbox 연동 슬롯)
  - 대응: FEAT-POST-DETAIL, FEAT-LIGHTBOX, US-014
  - 검증: 이미지에 alt 표시, 클릭 이벤트 연동 준비

- [ ] **[M1-35]** `MdxLink.tsx` -- 외부 링크 새 탭, 내부 링크 클라이언트 네비
  - 대응: FEAT-POST-DETAIL
  - 검증: 외부 URL에 `target="_blank"`, 내부 경로는 Next.js Link

- [ ] **[M1-36]** `MdxTable.tsx` -- 반응형 테이블 래퍼
  - 대응: FEAT-POST-DETAIL
  - 검증: overflow-x scroll 적용

- [ ] **[M1-37]** `Callout.tsx` -- 주의/팁/경고 박스 (MDX 커스텀 컴포넌트)
  - 대응: FEAT-POST-DETAIL
  - 검증: 타입별 아이콘/색상 분기 렌더

- [ ] **[M1-38]** 시리즈 네비게이션 -- 시리즈 소속 시 상단 배지 + 이전/다음 시리즈 포스트 링크
  - 대응: FEAT-POST-DETAIL, FEAT-SERIES-DETAIL, US-012
  - 검증: 시리즈 포스트에 "1/5", "2/5" 순서 표시, 이전/다음 링크

- [ ] **[M1-39]** `PostNavigation.tsx` -- 이전/다음 포스트 카드
  - 대응: FEAT-POST-DETAIL, US-002
  - 검증: 더미 데이터로 이전/다음 포스트 카드 렌더

- [ ] **[M1-40]** `RelatedPosts.tsx` -- 관련 포스트 3장 (태그 겹침 기반, 2장 미만이면 숨김)
  - 대응: FEAT-POST-DETAIL, US-015
  - 검증: 더미 데이터로 관련 포스트 카드 3장 표시

- [ ] **[M1-41]** `ShareButtons.tsx` -- 링크 복사 / X(Twitter) / LinkedIn, Web Share API 분기
  - 대응: FEAT-POST-DETAIL, US-007
  - 검증: 공유 버튼 렌더, 링크 복사 클릭 시 클립보드 복사

- [ ] **[M1-42]** `ScrollToTop.tsx` -- 우하단 버튼 (스크롤 > 400px 시 노출)
  - 대응: FEAT-READING-AIDS, US-002
  - 검증: 스크롤 400px 초과 시 버튼 표시, 클릭 시 상단 이동

- [ ] **[M1-43]** `ScrollReset.tsx` -- 페이지 전환 시 스크롤 상단 초기화
  - 대응: FEAT-READING-AIDS
  - 검증: 라우트 변경 시 스크롤 위치 (0, 0) 복원

#### 태그 (FEAT-TAGS-HUB, FEAT-TAG-DETAIL)

- [ ] **[M1-44]** `TagHub` 페이지 -- 태그 카드 그리드 (태그명 + 포스트 수, 포스트 수 기준 정렬)
  - 대응: FEAT-TAGS-HUB, US-011, MOD-tags
  - 검증: 더미 TagCount로 3~4 column 그리드 렌더

- [ ] **[M1-45]** `TagDetail` 페이지 -- 태그 헤더 + 해당 태그 포스트 목록 (날짜 내림차순)
  - 대응: FEAT-TAG-DETAIL, US-011, MOD-tags
  - 검증: 더미 데이터로 필터된 포스트 목록 렌더, 한글 태그 URL encoding/decoding 처리

- [ ] **[M1-46]** `TagChip.tsx` -- 태그 칩 컴포넌트 (클릭 시 `/tags/[tag]` 이동)
  - 대응: FEAT-TAGS-HUB, FEAT-TAG-DETAIL, MOD-tags
  - 검증: 클릭 시 태그 상세로 이동

#### 시리즈 (FEAT-SERIES-HUB, FEAT-SERIES-DETAIL)

- [ ] **[M1-47]** `SeriesHub` 페이지 -- 시리즈 카드 (아이콘, 이름, 총 포스트 수, 첫 3개 미리보기, "전체 보기")
  - 대응: FEAT-SERIES-HUB, US-012, MOD-series
  - 검증: 더미 Series로 카드 렌더, 1편짜리 시리즈는 미리보기 생략

- [ ] **[M1-48]** `SeriesDetail` 페이지 -- 시리즈 헤더(이름/설명/총 편수) + 순서 네비 + 포스트 목록 (seriesOrder 오름차순)
  - 대응: FEAT-SERIES-DETAIL, US-012, MOD-series
  - 검증: 더미 데이터로 순서 네비게이션(1/5, 2/5 ...) 표시

- [ ] **[M1-49]** `SeriesNavigation.tsx` -- 시리즈 이전/다음 포스트 네비게이션
  - 대응: FEAT-SERIES-DETAIL, US-012, MOD-series
  - 검증: 이전/다음 포스트 링크 렌더

#### About (FEAT-ABOUT)

- [ ] **[M1-50]** `AboutProfile` 컴포넌트 -- 프로필 사진, 이름, 직무 타이틀, 소셜 링크, 마크다운 본문 placeholder
  - 대응: FEAT-ABOUT, MOD-about
  - 검증: 더미 프로필 정보와 마크다운 영역 렌더

#### 검색 (FEAT-SEARCH)

- [ ] **[M1-51]** `SearchButton.tsx` -- 헤더 내 검색 아이콘 (클릭/단축키로 모달 오픈)
  - 대응: FEAT-SEARCH, US-003, MOD-search
  - 검증: 아이콘 클릭 시 SearchModal 오픈

- [ ] **[M1-52]** `SearchModal.tsx` -- 상단 중앙 모달, 입력창, 결과 리스트, 키보드 네비
  - 대응: FEAT-SEARCH, US-003, MOD-search
  - 검증: 모달 오픈 시 입력창 포커스, 더미 결과 표시, Esc로 닫기

- [ ] **[M1-53]** `useSearchShortcut` -- Cmd+K / Ctrl+K 단축키 훅
  - 대응: FEAT-SEARCH, US-003, MOD-search
  - 검증: 단축키 입력 시 모달 오픈 콜백 호출

- [ ] **[M1-54]** 검색 결과 0건 상태 -- "검색 결과 없음" 안내 + 관련 태그 추천 3개
  - 대응: FEAT-SEARCH, US-003
  - 검증: 결과 0건일 때 빈 상태 UI 렌더

#### 조회수 (FEAT-VIEW-COUNTER)

- [ ] **[M1-55]** `ViewCounter.tsx` -- 아이콘 + 숫자 placeholder (Suspense fallback 포함)
  - 대응: FEAT-VIEW-COUNTER, US-013, MOD-views
  - 검증: 더미 숫자 표시, fallback은 동일 크기 placeholder

#### 테마 (FEAT-THEME)

- [ ] **[M1-56]** `ThemeSwitcher.tsx` -- Sun/Moon 아이콘 토글 (next-themes 기반)
  - 대응: FEAT-THEME, US-004, MOD-theme
  - 검증: 클릭 시 light/dark 전환, FOUC 없음, `prefers-reduced-motion`이면 트랜지션 비활성

#### 라이트박스 (FEAT-LIGHTBOX)

- [ ] **[M1-57]** `LightboxProvider.tsx` + `ImageLightbox.tsx` -- 이미지 모달 뷰어 (fade 300ms, Esc/백드롭 닫기, 화살표 carousel)
  - 대응: FEAT-LIGHTBOX, US-014, MOD-lightbox
  - 검증: 더미 이미지 클릭 시 라이트박스 오픈, 키보드 네비, 1장일 때 화살표 숨김

#### 댓글 (FEAT-COMMENTS)

- [ ] **[M1-58]** `CommentsSection.tsx` -- Giscus placeholder (lazy load 슬롯)
  - 대응: FEAT-COMMENTS, US-005, MOD-comments
  - 검증: 포스트 하단에 댓글 영역 placeholder 렌더, private 포스트에서 비활성

#### 모션 & 전환

- [x] **[M1-59]** `FadeInWhenVisible.tsx` -- framer-motion `useInView` + rAF 기반 fade + slide-up
  - 대응: 전체 FEAT
  - 검증: 뷰포트 진입 시 fade-in 효과, `reducedMotion="user"` 자동 존중 (MotionConfig)
  - 구현: `useInView(ref, { once: true, margin: "-50px" })` + rAF `setShouldAnimate` 지연으로 FOUC 방지

- [x] **[M1-60]** `PageTransition.tsx` -- framer-motion `motion.div` + rAF 기반 페이지 전환
  - 대응: 전체 FEAT
  - 검증: `key={pathname}` 리마운트 시 fade + slide-up 재실행, hydration flash 없음
  - 구현: `key={pathname}` remount 전략 + rAF `setMounted` → effect deps `[]`로 `set-state-in-effect` 룰 준수

#### shadcn/ui 프리미티브

- [ ] **[M1-61]** 필요한 shadcn/ui 프리미티브 설치 -- Dialog, DropdownMenu, Toast, Tooltip, Badge, Accordion 등
  - 대응: ADR-010, 전체 FEAT
  - 검증: `src/shared/ui/`에 PascalCase로 존재, 직접 경로 import 가능

---

### M2: Content Pipeline

**목표**: `contents/` Git Submodule 연동, MDX 파싱/검증 파이프라인, 읽기 시간 계산, 더미 데이터를 실 MDX로 교체. TDD 본격 시작.

**Entry 기준**: M1 Exit 달성 (더미 데이터 기준 전 페이지 UI 완성, fixture 배열이 `src/shared/fixtures/`에 격리)

**Exit 기준**: 샘플 MDX 10편이 실데이터로 렌더, `readingTimeMinutes`가 포스트별로 다른 값, `src/shared/fixtures/` 의존 제거, 유틸 Unit 테스트 녹색

**예상 기간**: 1~2주

#### Submodule 설정

- [ ] **[M2-01]** `contents/` Git Submodule 구성 (`.gitmodules`)
  - 대응: US-006, ADR-004
  - 검증: `git submodule update --init --recursive`로 콘텐츠 clone 성공

- [ ] **[M2-02]** `scripts/vercel-submodule-workaround.sh` -- Vercel 빌드 환경 submodule clone 스크립트
  - 대응: US-006
  - 검증: SSH URL -> HTTPS + 토큰 치환 후 submodule update 성공

#### 파싱 파이프라인 (TDD: 테스트 먼저 작성)

- [ ] **[M2-03]** **[TDD Red]** `parseFrontmatter` Unit 테스트 작성 -- 정상 파싱, `--`->`---` 보정, 스키마 위반 시 에러, slug/디렉토리 불일치 에러
  - 대응: US-006, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패 (구현 미존재)

- [ ] **[M2-04]** **[TDD Green]** `parseFrontmatter` 구현 -- gray-matter + PostFrontmatterSchema(Zod) + `--`->`---` 보정 + slug 검증
  - 대응: US-006, MOD-posts
  - 검증: M2-03 테스트 녹색

- [ ] **[M2-05]** `PostFrontmatterSchema` Zod 스키마 (`features/posts/schemas/frontmatter.ts`)
  - 대응: MOD-posts
  - 검증: series/seriesOrder 쌍 검증 refine 포함

- [ ] **[M2-06]** **[TDD Red]** `calculateReadingTime` Unit 테스트 작성 -- 한국어 500자/분, 코드/이미지/수식 제외, 최소 1분, 포스트별 다른 값
  - 대응: US-008, ADR-008, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-07]** **[TDD Green]** `calculateReadingTime` 구현 -- 코드 블록/이미지/수식 제거 -> 문자 수 / 500 -> ceil -> max(1, result)
  - 대응: US-008, ADR-008, MOD-posts
  - 검증: M2-06 테스트 녹색

- [ ] **[M2-08]** **[TDD Red]** `extractTocFromMarkdown` Unit 테스트 작성 -- h2/h3 추출, id slugify, level 정확도
  - 대응: FEAT-POST-DETAIL, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-09]** **[TDD Green]** `extractTocFromMarkdown` 구현 -- 마크다운 h2/h3 파싱 -> TocItem[] 생성
  - 대응: FEAT-POST-DETAIL, MOD-posts
  - 검증: M2-08 테스트 녹색

- [ ] **[M2-10]** **[TDD Red]** `slugify` Unit 테스트 작성
  - 대응: 전체 MOD-\*
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-11]** **[TDD Green]** `slugify` 구현
  - 대응: 전체 MOD-\*
  - 검증: M2-10 테스트 녹색

#### 서비스 함수 (TDD)

- [ ] **[M2-12]** **[TDD Red]** `getAllPosts` Unit 테스트 -- 날짜 내림차순 정렬, includePrivate 옵션, private 제외 기본
  - 대응: US-001, US-006, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-13]** **[TDD Green]** `getAllPosts` 구현 -- `contents/posts/*/index.mdx` 스캔 -> parseFrontmatter -> sort
  - 대응: US-001, US-006, MOD-posts
  - 검증: M2-12 테스트 녹색

- [ ] **[M2-14]** **[TDD Red]** `getPostDetail` Unit 테스트 -- slug로 상세 조회, 없으면 null
  - 대응: US-002, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-15]** **[TDD Green]** `getPostDetail` 구현 -- 파일 읽기 -> parseFrontmatter -> TOC 추출 -> readingTime 계산 -> PostDetail 조립
  - 대응: US-002, MOD-posts
  - 검증: M2-14 테스트 녹색

- [ ] **[M2-16]** **[TDD Red]** `sortPostsByDateDescending` Unit 테스트
  - 대응: MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M2-17]** **[TDD Green]** `sortPostsByDateDescending` 구현
  - 대응: MOD-posts
  - 검증: M2-16 테스트 녹색

#### 이미지 복사 스크립트

- [ ] **[M2-18]** `scripts/copy-content-images.mjs` -- `contents/posts/*/images/**` -> `public/posts/{slug}/images/**` (mtime 비교, 멱등, prune)
  - 대응: US-006
  - 검증: 빌드 전 실행 시 이미지 복사 성공, 삭제된 원본 prune

#### MDX 렌더링

- [ ] **[M2-19]** `next-mdx-remote/rsc` 통합 -- `CustomMDX.tsx` 컴포넌트 맵 (MdxHeading, MdxImage, MdxPre, MdxLink, MdxTable, ShikiCodeBlock, Callout)
  - 대응: US-002, FEAT-POST-DETAIL, ADR-006
  - 검증: MDX 본문이 커스텀 컴포넌트로 렌더

- [ ] **[M2-20]** Shiki 3 서버 하이라이팅 설정 -- `github-light`/`github-dark` 듀얼 테마
  - 대응: US-002, FEAT-POST-DETAIL, ADR-001
  - 검증: 코드 블록이 light/dark 테마에 맞게 하이라이트

- [ ] **[M2-21]** remark/rehype 플러그인 설정 -- `remark-gfm`, `remark-breaks`
  - 대응: FEAT-POST-DETAIL
  - 검증: GFM 테이블, 체크박스, 한국어 줄바꿈 정상 렌더

#### 더미 -> 실데이터 교체

- [ ] **[M2-22]** `RT-/posts/[slug]`에 `generateStaticParams` 연결 -- 모든 public 포스트 slug 사전 생성
  - 대응: RT-/posts/[slug]
  - 검증: 빌드 시 모든 포스트 정적 페이지 생성

- [ ] **[M2-23]** 홈, 포스트 목록, 포스트 상세 페이지에서 fixture import 제거 -> 실 서비스 함수 호출
  - 대응: US-001, US-002, FEAT-HOME, FEAT-POSTS-LIST, FEAT-POST-DETAIL
  - 검증: 샘플 MDX 10편이 실데이터로 렌더

- [ ] **[M2-24]** `src/shared/fixtures/` 의존 완전 제거 (또는 테스트 전용으로 격리)
  - 대응: ADR-009
  - 검증: 프로덕션 코드에서 fixture import 0건

---

### M3: Feature Wiring

**목표**: 검색(Fuse.js), 조회수(Vercel KV), 댓글(Giscus), 테마 persistence, 라이트박스를 실데이터와 연결. 모든 P0 User Story AC 충족.

**Entry 기준**: M2 Exit 달성 (샘플 MDX 10편 실데이터 렌더, fixture 의존 제거, 유틸 Unit 테스트 녹색)

**Exit 기준**: US-001~US-008 전부 통과, 대응 Integration 테스트 녹색

**예상 기간**: 2주

#### 검색 (MOD-search, FEAT-SEARCH)

- [ ] **[M3-01]** **[TDD Red]** `useSearch` Integration 테스트 -- Fuse.js 인덱싱, 200ms 디바운스, 최대 10결과, 스코어 순, 0건 시 빈 배열
  - 대응: US-003, MOD-search
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-02]** **[TDD Green]** `useSearch` 구현 -- Fuse.js 인덱스 (가중치: title 0.5, description 0.3, tags 0.2), threshold 0.4, limit 10
  - 대응: US-003, MOD-search, ADR-002
  - 검증: M3-01 테스트 녹색

- [ ] **[M3-03]** **[TDD Red]** SearchModal Integration 테스트 -- 모달 오픈/닫기, 타이핑 -> 결과 갱신, 결과 클릭 이동, Esc 닫기, 0건 시 태그 추천
  - 대응: US-003, MOD-search
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-04]** **[TDD Green]** SearchModal에 실 Fuse.js 인덱스 연결 -- 결과 하이라이트, 키보드 화살표 포커스, Enter 이동
  - 대응: US-003, MOD-search
  - 검증: M3-03 테스트 녹색

#### 조회수 (MOD-views, FEAT-VIEW-COUNTER)

- [ ] **[M3-05]** **[TDD Red]** `getPostViews` / `incrementPostViews` / `getBatchPostViews` Unit 테스트 (MSW로 `/api/views` 모킹)
  - 대응: US-013, MOD-views
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-06]** **[TDD Green]** KV 클라이언트 구현 -- `@vercel/kv` 연동, `incr`/`mget` 파이프라인, N+1 방지
  - 대응: US-013, MOD-views, ADR-003
  - 검증: M3-05 테스트 녹색

- [ ] **[M3-07]** **[TDD Red]** `RT-/api/views` Route Handler 테스트 -- GET(slug -> views), POST(slug -> 204), 잘못된 요청 400
  - 대응: RT-/api/views, MOD-views
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-08]** **[TDD Green]** `RT-/api/views` Route Handler 구현 -- GET/POST 핸들러, Cache-Control: no-store
  - 대응: RT-/api/views, MOD-views
  - 검증: M3-07 테스트 녹색

- [ ] **[M3-09]** **[TDD Red]** ViewCounter Integration 테스트 -- Suspense fallback -> 실 숫자, KV 실패 시 "---" fallback, 동일 세션 중복 방지 best-effort
  - 대응: US-013, MOD-views
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-10]** **[TDD Green]** ViewCounter에 실 KV 연결 -- 포스트 mount 시 +1 POST, Suspense boundary
  - 대응: US-013, MOD-views
  - 검증: M3-09 테스트 녹색

#### 댓글 (MOD-comments, FEAT-COMMENTS)

- [ ] **[M3-11]** **[TDD Red]** CommentsSection Integration 테스트 -- Giscus lazy mount, 테마 연동, private 포스트 비활성, 로드 실패 시 placeholder + 재시도
  - 대응: US-005, MOD-comments
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-12]** **[TDD Green]** CommentsSection 구현 -- `@giscus/react` IntersectionObserver lazy mount, 환경변수 4종 주입, 테마 전환 동기화
  - 대응: US-005, MOD-comments
  - 검증: M3-11 테스트 녹색

#### 테마 Persistence (MOD-theme, FEAT-THEME)

- [ ] **[M3-13]** **[TDD Red]** ThemeSwitcher Integration 테스트 -- 시스템 테마 감지, 토글 시 `.dark` 클래스, 재방문 시 cookie/localStorage 복원, FOUC 없음, View Transitions API 분기
  - 대응: US-004, MOD-theme, ADR-011
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-14]** **[TDD Green]** ThemeSwitcher + useTheme 완성 -- next-themes 래퍼, `useSyncExternalStore` mounted 감지, `document.startViewTransition` progressive enhancement
  - 대응: US-004, MOD-theme, ADR-011
  - 검증: M3-13 테스트 녹색

#### 라이트박스 (MOD-lightbox, FEAT-LIGHTBOX)

- [ ] **[M3-15]** **[TDD Red]** ImageLightbox Integration 테스트 -- 이미지 클릭 -> 라이트박스 오픈(fade 300ms), Esc/백드롭 닫기, 화살표 carousel, 1장일 때 화살표 숨김
  - 대응: US-014, MOD-lightbox
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-16]** **[TDD Green]** ImageLightbox + LightboxProvider 구현 -- `yet-another-react-lightbox` 연동, `next/dynamic` 지연 로드
  - 대응: US-014, MOD-lightbox
  - 검증: M3-15 테스트 녹색

#### 포스트 목록 / 상세 AC 완성

- [ ] **[M3-17]** **[TDD Red]** PostList Integration 테스트 -- 최신순 정렬, 카드 6장(홈)/전체(목록), thumbnail 유무 분기, 카드 클릭 이동
  - 대응: US-001
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-18]** **[TDD Green]** PostList에 실 서비스 연결 완성
  - 대응: US-001
  - 검증: M3-17 테스트 녹색, US-001 AC 전부 충족

- [ ] **[M3-19]** **[TDD Red]** PostDetail Integration 테스트 -- 메타 헤더, TOC 클릭 앵커 스크롤, 코드 복사, 이전/다음 포스트
  - 대응: US-002
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M3-20]** **[TDD Green]** PostDetail 완성 -- TOC 앵커 + URL hash, 코드 블록 복사, 읽기 시간 실수치
  - 대응: US-002, US-008
  - 검증: M3-19 테스트 녹색, US-002/US-008 AC 전부 충족

#### 저자 발행 워크플로우

- [ ] **[M3-21]** `pnpm build` 파이프라인 통합 -- submodule workaround -> copy-content-images -> next build
  - 대응: US-006
  - 검증: frontmatter 스키마 위반 시 빌드 실패 + slug/필드 에러 메시지 출력

---

### M4: Hubs & Aggregations

**목표**: 태그/시리즈 집계, Popular 빌드 타임 스냅샷(`ADR-007`), 관련 포스트/인접 포스트. 모든 P1 User Story AC 충족.

**Entry 기준**: M3 Exit 달성 (US-001~US-008 통과, Integration 테스트 녹색)

**Exit 기준**: 홈 Popular 3블록 실데이터 렌더, US-011~US-016 통과, 대응 테스트 녹색

**예상 기간**: 1~2주

#### 태그 집계 (MOD-tags)

- [ ] **[M4-01]** **[TDD Red]** `getAllTags` / `getPostsByTag` / `getTagCounts` Unit 테스트 -- private 제외, 포스트 수 정렬
  - 대응: US-011, MOD-tags
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-02]** **[TDD Green]** 태그 서비스 구현 -- 전체 포스트에서 태그 추출, 카운트 집계, private 제외
  - 대응: US-011, MOD-tags
  - 검증: M4-01 테스트 녹색

- [ ] **[M4-03]** **[TDD Red]** `getTrendingTags` Unit 테스트 -- public 포스트 수 내림차순 상위 N, private 기여분 제외
  - 대응: US-016, MOD-tags, ADR-007
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-04]** **[TDD Green]** `getTrendingTags` 구현
  - 대응: US-016, MOD-tags, ADR-007
  - 검증: M4-03 테스트 녹색

- [ ] **[M4-05]** `RT-/tags` + `RT-/tags/[tag]`에 `generateStaticParams` 연결 + 실 서비스 호출
  - 대응: RT-/tags, RT-/tags/[tag], US-011
  - 검증: 빌드 시 모든 태그 정적 페이지 생성, 한글 태그 URL encoding/decoding 정상

#### 시리즈 집계 (MOD-series)

- [ ] **[M4-06]** **[TDD Red]** `getAllSeries` / `getSeriesDetail` / `getSeriesStats` Unit 테스트 -- seriesOrder 오름차순, private 제외
  - 대응: US-012, MOD-series
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-07]** **[TDD Green]** 시리즈 서비스 구현 -- 포스트의 series/seriesOrder로 그룹핑, 정렬
  - 대응: US-012, MOD-series
  - 검증: M4-06 테스트 녹색

- [ ] **[M4-08]** **[TDD Red]** `getTrendingSeries` Unit 테스트 -- 소속 public 포스트 수 내림차순, 동률 시 최근 편 발행일 우선, private 제외
  - 대응: US-016, MOD-series, ADR-007
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-09]** **[TDD Green]** `getTrendingSeries` 구현
  - 대응: US-016, MOD-series, ADR-007
  - 검증: M4-08 테스트 녹색

- [ ] **[M4-10]** `RT-/series` + `RT-/series/[slug]`에 `generateStaticParams` 연결 + 실 서비스 호출
  - 대응: RT-/series, RT-/series/[slug], US-012
  - 검증: 빌드 시 모든 시리즈 정적 페이지 생성

#### Popular 빌드 타임 스냅샷 (ADR-007)

- [ ] **[M4-11]** **[TDD Red]** `getTrendingPosts` Unit 테스트 -- KV 누적 조회수 내림차순 5건, 동률 시 최근 발행일, private 제외, KV 실패 시 최근 발행순 fallback
  - 대응: US-016, MOD-posts, ADR-007
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-12]** **[TDD Green]** `getTrendingPosts` 구현 -- 빌드 타임 KV 스냅샷 + fallback 로직
  - 대응: US-016, MOD-posts, ADR-007
  - 검증: M4-11 테스트 녹색

- [ ] **[M4-13]** `TrendingSnapshot` 생성 로직 -- popularPosts + trendingSeries + trendingTags + generatedAt + fallback 플래그
  - 대응: US-016, ADR-007
  - 검증: 빌드 시 TrendingSnapshot 타입의 정적 데이터 생성

- [ ] **[M4-14]** 홈 사이드바 Popular 3블록을 실데이터(빌드 타임 스냅샷)로 교체
  - 대응: US-016, FEAT-HOME
  - 검증: 홈에서 Popular Posts 5건, Trending Series 3건, Trending Tags 10건 실데이터 렌더

#### 관련 포스트 / 인접 포스트

- [ ] **[M4-15]** **[TDD Red]** `findRelatedPostsByTags` Unit 테스트 -- 태그 겹침 기반 상위 3건, overlapScore 정확도, 2장 미만이면 빈 배열
  - 대응: US-015, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-16]** **[TDD Green]** `findRelatedPostsByTags` 구현
  - 대응: US-015, MOD-posts
  - 검증: M4-15 테스트 녹색

- [ ] **[M4-17]** **[TDD Red]** `findAdjacentPosts` Unit 테스트 -- 날짜순 이전/다음, 첫/마지막 포스트 엣지케이스
  - 대응: US-002, MOD-posts
  - 검증: 테스트가 올바른 이유로 실패

- [ ] **[M4-18]** **[TDD Green]** `findAdjacentPosts` 구현
  - 대응: US-002, MOD-posts
  - 검증: M4-17 테스트 녹색

- [ ] **[M4-19]** 포스트 상세에 관련 포스트 + 인접 포스트 실데이터 연결
  - 대응: US-015, FEAT-POST-DETAIL
  - 검증: 포스트 하단에 관련 포스트 3장 + 이전/다음 카드 렌더

#### About 실데이터

- [ ] **[M4-20]** `getAboutContent` 구현 -- `contents/about/index.md` 파싱 및 MdxRemote 렌더
  - 대응: FEAT-ABOUT, MOD-about
  - 검증: About 페이지에 실제 마크다운 본문 렌더

#### Private 포스트 정책 Integration 테스트

- [ ] **[M4-21]** **[TDD]** Private 포스트 제외 정책 Integration 테스트 -- 목록/검색/관련/인접/태그 집계/시리즈 집계/사이드바 모두에서 private 제외
  - 대응: US-001~US-016 전체, FEAT-POSTS-LIST
  - 검증: `private: true` 포스트가 6군데 노출 면에서 모두 제외됨을 증명

---

### M5: SEO & Syndication

**목표**: 전 페이지 Metadata, JSON-LD, OG 이미지, Sitemap, RSS, Robots 완성

**Entry 기준**: M4 Exit 달성 (US-011~US-016 통과, Popular 3블록 실데이터 렌더)

**Exit 기준**: Lighthouse SEO 100, Rich Results Test 통과, Facebook Sharing Debugger 통과

**예상 기간**: 1주

#### Metadata 공통 인프라

- [ ] **[M5-01]** `buildMetadata` 공통 헬퍼 (`shared/seo/build-metadata.ts`) -- title/description/canonical/og/twitter 표준화
  - 대응: FEAT-METADATA-OG
  - 검증: `buildMetadata({ title, description, path, image, type, publishedAt, noIndex })` 호출 시 올바른 Metadata 객체 반환

- [ ] **[M5-02]** 전 라우트에 `generateMetadata` 적용 -- 정적 페이지 + 동적 페이지 (포스트/태그/시리즈)
  - 대응: FEAT-METADATA-OG, RT-\* 전체
  - 검증: 모든 페이지에서 title/description/og 메타 태그 존재

- [ ] **[M5-03]** Private 포스트 `noindex` + JSON-LD 생략 처리
  - 대응: FEAT-METADATA-OG
  - 검증: `private: true` 포스트 상세에 `<meta name="robots" content="noindex, nofollow" />` + JSON-LD 미출력

#### JSON-LD

- [ ] **[M5-04]** `WebSite` JSON-LD -- 루트 `layout.tsx`에 1회
  - 대응: FEAT-METADATA-OG
  - 검증: Rich Results Test에서 WebSite 구조화 데이터 인식

- [ ] **[M5-05]** `BlogPosting` JSON-LD -- 포스트 상세에 1회 (headline, datePublished, author, keywords, image, url)
  - 대응: FEAT-METADATA-OG
  - 검증: Rich Results Test에서 BlogPosting 인식

- [ ] **[M5-06]** `BreadcrumbList` JSON-LD -- 포스트/태그/시리즈 상세에 계층 1->2->3
  - 대응: FEAT-METADATA-OG
  - 검증: Rich Results Test에서 BreadcrumbList 인식

#### OG 이미지

- [ ] **[M5-07]** `RT-/og` Edge Handler 완성 -- thumbnail 있으면 프록시, 없으면 `@vercel/og` ImageResponse (1200x630, 다크 그라디언트, title 48px, tag 20px, 로고)
  - 대응: RT-/og, US-021, FEAT-METADATA-OG
  - 검증: `/og?title=...&tag=...` 호출 시 1200x630 이미지 반환, title 120자 초과 시 truncate

#### Sitemap

- [ ] **[M5-08]** `RT-/sitemap.xml` 완성 -- 정적 페이지 + 모든 public 포스트/시리즈/태그, priority/changefreq 표 준수, private 제외
  - 대응: RT-/sitemap.xml, FEAT-SITEMAP
  - 검증: 유효한 XML, private 포스트 미포함, priority 값 일치

#### RSS

- [ ] **[M5-09]** `RT-/rss` Route Handler 완성 -- RSS 2.0 XML, 최신 50편, private 제외, title/link/guid/description/pubDate/author/category
  - 대응: RT-/rss, FEAT-RSS, US-022
  - 검증: 유효한 RSS 2.0 XML, private 포스트 미포함

#### Robots

- [ ] **[M5-10]** `RT-/robots.txt` 완성 -- `/*` allow, sitemap URL 포함
  - 대응: RT-/robots.txt
  - 검증: 유효한 robots.txt, Sitemap 경로 포함

---

### M6: A11y & Perf

**목표**: 접근성(WCAG 2.1 AA) 및 성능(Core Web Vitals) 기준 달성

**Entry 기준**: M5 Exit 달성 (Lighthouse SEO 100, Rich Results Test 통과)

**Exit 기준**: NFR-001~006 전부 green, axe-core 0 critical, 키보드만으로 모든 핵심 경로 탐색 가능

**예상 기간**: 1주

#### 접근성

- [ ] **[M6-01]** Skip link 추가 -- `<a href="#main">본문 바로가기</a>`
  - 대응: FEAT-NAVIGATION
  - 검증: Tab 키로 Skip link 접근, 활성화 시 main 영역으로 포커스 이동

- [ ] **[M6-02]** 전 버튼/아이콘 링크에 `aria-label` 검수
  - 대응: 전체 FEAT
  - 검증: axe-core 자동 감사에서 aria-label 관련 경고 0건

- [ ] **[M6-03]** 모달/드로어 접근성 -- `role="dialog"` + `aria-modal="true"` + 포커스 트랩
  - 대응: FEAT-SEARCH, FEAT-NAVIGATION, FEAT-LIGHTBOX
  - 검증: SearchModal/Drawer/Lightbox에서 Tab이 내부에 트랩, Esc로 닫기

- [ ] **[M6-04]** 포커스 링 전역 스타일 -- `focus-visible` 2px outline
  - 대응: 전체 FEAT
  - 검증: 키보드 탐색 시 모든 인터랙티브 요소에 포커스 링 표시

- [ ] **[M6-05]** 명암 대비 검수 -- 본문 4.5:1, 대제목 3:1, 코드 하이라이트 7:1(AAA) 목표
  - 대응: 전체 FEAT
  - 검증: Chrome DevTools Contrast Checker로 기준 충족

- [ ] **[M6-06]** `prefers-reduced-motion` 존중 -- 모션 비활성화
  - 대응: 전체 FEAT
  - 검증: reduced-motion 설정 시 framer-motion/View Transitions 비활성

- [ ] **[M6-07]** 키보드 맵 검증 -- Cmd+K(검색), Esc(닫기), 화살표(라이트박스), Tab(포커스)
  - 대응: 전체 FEAT
  - 검증: 키보드만으로 홈 -> 포스트 -> 검색 -> 라이트박스 전체 경로 탐색 가능

#### 성능

- [ ] **[M6-08]** LCP 최적화 -- `next/image` + sharp, 이미지 width/height 명시, priority 설정
  - 대응: NFR-001 (LCP < 2.5s)
  - 검증: Speed Insights p75 mobile LCP < 2.5s

- [ ] **[M6-09]** CLS 방지 -- 이미지 dimension 예약, 폰트 swap 안정화
  - 대응: NFR-002 (CLS < 0.1)
  - 검증: Speed Insights CLS < 0.1

- [ ] **[M6-10]** INP 최적화 -- 인터랙션 핸들러 비동기 처리, `framer-motion`/`yet-another-react-lightbox` 지연 로드
  - 대응: NFR-003 (INP < 200ms)
  - 검증: Speed Insights INP < 200ms

- [ ] **[M6-11]** JS Transfer 최적화 -- 홈 기준 < 120KB gzipped
  - 대응: NFR-005
  - 검증: `next build` 분석에서 홈 JS transfer < 120KB

- [ ] **[M6-12]** 폰트 서브셋 최적화 -- Pretendard Variable korean + latin
  - 대응: NFR-006 (FOUT < 100ms)
  - 검증: next/font 서브셋 적용, FOUT < 100ms

- [ ] **[M6-13]** Lighthouse Performance 검증 -- >= 95점
  - 대응: NFR-004
  - 검증: Lighthouse Performance >= 95

#### 관측

- [ ] **[M6-14]** `@vercel/analytics` + `@vercel/speed-insights` 루트 layout 주입
  - 대응: NFR-001~004
  - 검증: `<Analytics />` + `<SpeedInsights />` 렌더

---

### M7: Polish

**목표**: E2E 스모크 테스트, P2 스토리 검토, Production 배포

**Entry 기준**: M6 Exit 달성 (NFR-001~006 통과, axe 0 critical)

**Exit 기준**: Production 첫 배포 완료, Change Log 확정

**예상 기간**: 지속

#### E2E 스모크 테스트 (Playwright)

- [ ] **[M7-01]** E2E: 홈 -> 포스트 카드 클릭 -> 상세 렌더 확인
  - 대응: US-001, US-002
  - 검증: Playwright 테스트 녹색

- [ ] **[M7-02]** E2E: Cmd+K -> 검색 모달 -> 타이핑 -> 결과 클릭 -> 상세 이동
  - 대응: US-003
  - 검증: Playwright 테스트 녹색

- [ ] **[M7-03]** E2E: 포스트 상세 -> TOC 항목 클릭 -> 스크롤 이동
  - 대응: US-002
  - 검증: Playwright 테스트 녹색

- [ ] **[M7-04]** E2E: 테마 토글 -> 다크 모드 전환 -> 새로고침 후 유지
  - 대응: US-004
  - 검증: Playwright 테스트 녹색

- [ ] **[M7-05]** E2E (옵션): 모바일 뷰포트 -> 햄버거 -> Drawer 열림
  - 대응: FEAT-NAVIGATION
  - 검증: Playwright 테스트 녹색

#### P2 스토리 검토

- [ ] **[M7-06]** US-021 OG 이미지 동적 생성 검토 -- 이미 M5에서 기본 구현, 디자인 Polish
  - 대응: US-021, FEAT-METADATA-OG
  - 검증: thumbnail 없는 포스트의 OG 이미지 품질 확인

- [ ] **[M7-07]** US-022 RSS 구독 UI 검토 -- 푸터/헤더 RSS 아이콘이 `/rss`를 새 탭으로 열기
  - 대응: US-022, FEAT-RSS
  - 검증: RSS 아이콘 가시성, 클릭 시 새 탭

- [ ] **[M7-08]** US-023 검색 추천 키워드 검토 -- 빈 검색창에서 인기 태그 5개 + 최근 포스트 3개 추천
  - 대응: US-023, FEAT-SEARCH
  - 검증: 모달 오픈 직후 추천 콘텐츠 표시

#### Production 배포

- [ ] **[M7-09]** Vercel 환경변수 설정 -- 전 환경(dev/preview/prod) 매트릭스 완성
  - 대응: 배포
  - 검증: NEXT_PUBLIC_SITE_URL, GISCUS 4종, KV 5종, GITHUB_REPO_CLONE_TOKEN 설정

- [ ] **[M7-10]** CI/CD 파이프라인 확정 -- GitHub Actions (`ci.yaml`) + Vercel auto deploy
  - 대응: 배포
  - 검증: PR 생성 시 CI 녹색 + Preview URL, main 머지 시 Production 배포

- [ ] **[M7-11]** Production 첫 배포 + 배포 후 24h CWV 확인
  - 대응: NFR-001~004
  - 검증: Speed Insights에서 5개 지표 모두 green

- [ ] **[M7-12]** Change Log 확정 및 v1.0.0 태깅

#### A11y · Perf 후속 (M6 E2E 발견 결함 이월, 2026-04-27)

- [ ] **[M7-13]** 모바일 `PostCard.priority` 정책 보강 -- 모바일은 `index === 0`만 priority, `sizes` prop 분기
  - 대응: NFR-001 (LCP), M6-08 회귀
  - 검증: `console.warn` "preloaded but not used" 0건 (375px viewport 홈)
  - 발견: 2026-04-27 E2E 결함 D4

- [ ] **[M7-14]** 잘못된 slug `generateMetadata` `noIndex` 반환 -- 404 metadata "Post" fallback 제거
  - 대응: SEO 인덱싱 위생
  - 검증: `/posts/__nonexistent` 응답의 `<title>` = "404" + `robots noindex,nofollow`
  - 발견: 2026-04-27 E2E 결함 D2

- [ ] **[M7-15]** 한글 slug → 영문 kebab-case 매핑 + `next.config.ts` 301 redirect (GC 트랙 후보)
  - 대응: `.claude/rules/seo.md` "한글 slug 금지"
  - 작업: `contents/posts/*/index.mdx` frontmatter `series.slug`·`tags` 영문화 + 매핑 함수 + redirects
  - 검증: `/series/항해...` → `/series/hanghae-plus-frontend-6th` 301
  - 발견: 2026-04-27 E2E 결함 D1
  - 비고: contents/ submodule 변경 동반 — autonomy.md상 사용자 명시 승인 필수
  - 대응: 전체
  - 검증: CHANGELOG.md 또는 GitHub Release 생성

---

## 의존성 다이어그램

```
M0 Foundation
 |
 v
M1 UI Skeleton (All Pages)
 |   - 더미 데이터(fixture)로 전 페이지 UI 완성
 |   - 디자인 시스템/레이아웃/네비게이션 확정
 v
M2 Content Pipeline
 |   - Submodule + MDX 파서 + 읽기 시간
 |   - 더미 -> 실데이터 교체
 |   - TDD 본격 시작
 v
M3 Feature Wiring
 |   - Search (Fuse.js)          <- M2 (포스트 데이터)
 |   - Views (Vercel KV)         <- M0 (RT-/api/views)
 |   - Comments (Giscus)         <- M0 (env vars)
 |   - Theme persistence         <- M0 (next-themes)
 |   - Lightbox (실이미지)       <- M2 (이미지 복사)
 v
M4 Hubs & Aggregations
 |   - 태그 집계                 <- M2 (getAllPosts)
 |   - 시리즈 집계               <- M2 (getAllPosts)
 |   - Popular 스냅샷            <- M3 (KV views)
 |   - 관련/인접 포스트          <- M2 (포스트 데이터)
 v
M5 SEO & Syndication
 |   - Metadata/JSON-LD          <- M2 (포스트 데이터)
 |   - OG 이미지                 <- M0 (RT-/og)
 |   - Sitemap/RSS               <- M4 (집계 데이터)
 v
M6 A11y & Perf
 |   - 접근성 검수               <- M1~M4 (전 컴포넌트)
 |   - CWV 튜닝                  <- M1~M5 (전 페이지)
 v
M7 Polish
     - E2E 스모크                <- M1~M6 (전 기능)
     - P2 검토                   <- M5 (SEO 인프라)
     - Production 배포           <- M6 (품질 기준 통과)
```

---

## 리스크 및 대응 전략

| 리스크                             | 영향도                | 발생 확률 | 대응 전략                                                                     |
| ---------------------------------- | --------------------- | --------- | ----------------------------------------------------------------------------- |
| Submodule 토큰 만료/권한 오설정    | 높음 (배포 차단)      | 중        | `scripts/vercel-submodule-workaround.sh` 복구 런북, PAT 만료 90일 전 리마인더 |
| Vercel KV 비가용                   | 중 (조회수 표시 불가) | 낮음      | Suspense + silent fallback `"---"`, 사용자 영향 없음                          |
| Giscus 스팸/악용                   | 낮음 (품질 저하)      | 낮음      | GitHub Discussions 모더레이션, 문제 사용자 차단                               |
| 콘텐츠 발행 지속성 (1인)           | 중 (블로그 정체)      | 중        | 시리즈 로드맵 별도 관리, 최소 월 2편 목표                                     |
| Private 포스트 유출                | 높음 (신뢰도 훼손)    | 낮음      | 6군데 일관 제외 + Unit/Integration 테스트 증명                                |
| Fuse.js 인덱스 크기 임계 초과      | 중 (초기 로드 지연)   | 중 (장기) | ADR-002 청킹 전략, 포스트 80편 도달 시 전환 검토 (OQ-05)                      |
| Core Web Vitals 저하 (이미지 증가) | 중 (SEO/UX 하락)      | 중        | `next/image` + sharp + 썸네일 용량 가이드 (< 300KB)                           |

---

## 성공 지표 (KPIs)

| 카테고리 | 지표                                 | 목표               | 측정 도구                 | 대응 마일스톤 |
| -------- | ------------------------------------ | ------------------ | ------------------------- | ------------- |
| 북극성   | MRR (Meaningful Read Sessions/Month) | 증가 추세          | Vercel Analytics + 커스텀 | M7+           |
| 트래픽   | 월간 UV                              | >= 2,000 (12개월)  | Vercel Analytics          | M7+           |
| 콘텐츠   | 공개 포스트 수                       | >= 20편 (3개월)    | 내부 집계                 | M2+           |
| 참여     | 평균 체류 시간                       | >= 3분             | Vercel Analytics          | M3+           |
| 성능     | Core Web Vitals green                | 100%               | Speed Insights            | M6            |
| 성능     | Lighthouse Performance               | >= 95              | CI / 수동                 | M6            |
| SEO      | Google Search Console 인덱싱         | 모든 public 포스트 | GSC                       | M5            |

---

## Open Questions

| #     | 질문                                                                          | 결정 시점      |
| ----- | ----------------------------------------------------------------------------- | -------------- |
| OQ-01 | 중복 조회 방지 전략 -- v1 best-effort, v2에서 localStorage throttle 도입 여부 | M2 중          |
| OQ-02 | 포스트 하단 피드백 ("도움이 되었나요?") 도입 여부                             | M4             |
| OQ-03 | 검색 결과 본문 스니펫 하이라이트 포함 여부                                    | M2             |
| OQ-04 | 시리즈 완주율 측정 방식 (이벤트 vs 경로 분석)                                 | M3 이후        |
| OQ-05 | Fuse 인덱스 청킹 전환 시점 (포스트 >= 80편)                                   | 포스트 수 관찰 |

---

## 변경 이력

| 날짜       | 버전  | 변경 내용                                                                                        |
| ---------- | ----- | ------------------------------------------------------------------------------------------------ |
| 2026-04-12 | 1.0.0 | Product PRD v0.3.0 + Engineering PRD v0.4.0 기반 초안 작성. M0~M7 8개 마일스톤, 약 130개 태스크. |
