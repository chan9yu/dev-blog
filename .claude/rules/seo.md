# SEO 규약

검색 유입(장기 목표 50%)을 위한 메타·OG·sitemap·RSS 규약. seo-auditor가 이 규약으로 검수한다.

## Metadata (Next.js 16 App Router)

- 모든 `page.tsx`·`layout.tsx`는 `generateMetadata` 또는 정적 `metadata` export 필수.
- 타이틀 포맷: `"{페이지명} | chan9yu"` — `metadataBase`는 `shared/config/site.ts`의 프로덕션 URL로 고정.
- description 길이: **120~160자**. 검색 스니펫 잘림 방지. 중복 description 사용 금지 (페이지마다 고유).
- `openGraph.type`: 포스트=`article`, 목록/허브=`website`.
- `twitter.card`: `summary_large_image` 고정.
- `canonical`: 시리즈 포스트나 태그 중복 방지 위해 명시. `alternates.canonical` 경로는 루트 기준 절대 경로.

**Why:** Next.js 16 App Router의 metadata는 RSC에서 빌드 타임 계산되므로, 빌드 성공 = SEO 정합성 보장.

## OG 이미지 (`/og` Edge Route)

- 동적 생성 엔드포인트: `src/app/og/route.tsx`
- 크기: 1200×630 (Open Graph 표준)
- 포스트: 제목·시리즈명·발행일 포함. 이미지 텍스트는 **폰트 내장** 필수 (Pretendard Variable subset).
- frontmatter에 `thumbnail` 있으면 정적 이미지 우선, 없으면 `/og?title=...&tag=...` 동적 생성.

## Sitemap & RSS

- `src/app/sitemap.ts` — 모든 `/posts/[slug]`, `/tags/[tag]`, `/series/[slug]` 포함. `lastmod`는 frontmatter.updated || date.
- `src/app/rss/route.ts` — 최근 20개 포스트 기준, `<description>`은 frontmatter.description, `<content:encoded>`는 본문 HTML 렌더링.
- `src/app/robots.ts` — 프로덕션 외 환경은 전체 `Disallow: /`.

## Structured Data (JSON-LD)

- 포스트 상세: `BlogPosting` + `Person`(author) + `BreadcrumbList` 3종.
- About 페이지: `Person` 하나.
- JSON-LD는 `<script type="application/ld+json">`로 삽입, `dangerouslySetInnerHTML` 대신 `next/script`의 `strategy="afterInteractive"` 사용.

## Slug & URL 규약

- 포스트 slug: 영문 소문자+숫자+하이픈만. 한글 슬러그 금지(디코딩 이슈).
- slug 변경 시 **301 리다이렉트 필수** — `next.config.ts`의 `redirects()`에 추가하고, 동일 slug 재사용 금지 (검색 엔진 인덱스 충돌).
- 태그/시리즈 slug도 동일 규칙 적용.

## Performance 예산 (SEO Core Web Vitals)

- LCP < 2.5s, INP < 200ms, CLS < 0.1 (모바일 3G 기준)
- 이미지: `next/image` 필수, `sizes` 속성 생략 금지.
- 폰트: `next/font`로 self-host, `display: swap`.
- 타사 스크립트 로딩은 `next/script` + `strategy="lazyOnload"`.

## 검수 체크리스트 (seo-auditor가 자동 실행)

- [ ] frontmatter.description 120~160자 범위
- [ ] title 60자 이내, 브랜드 접미사 포함
- [ ] openGraph.images 해상도 1200×630
- [ ] canonical 설정 확인 (특히 시리즈·페이지네이션)
- [ ] slug가 소문자+영숫자+하이픈 패턴 준수
- [ ] sitemap에 새 포스트 entry 포함 확인
- [ ] `pnpm build` 성공 (메타데이터 타입 오류 차단)
