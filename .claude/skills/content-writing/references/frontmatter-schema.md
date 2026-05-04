# Frontmatter Schema

`contents/posts/{slug}/index.mdx`의 frontmatter 필드 정의. content-engineer·seo-auditor가 이 스키마를 기준으로 작성·검증.

## 완전한 스키마

```yaml
---
# 필수
title: string # 60자 이내, 단일 라인
description: string # 120~160자, 검색 스니펫에 노출
date: string # ISO 8601 (YYYY-MM-DD), 발행일
tags: string[] # 3~5개, kebab-case, 영문 소문자+숫자

# 선택
updated: string # ISO 8601, 최종 수정일 (수정 시 필수)
series:
  slug: string # 시리즈 식별자 (kebab-case)
  order: number # 시리즈 내 순번 (1부터)
cover:
  src: string # 상대 경로 (예: ./images/cover.png) 또는 절대 URL
  alt: string # 대체 텍스트 (필수 — 빈 문자열 허용하지 않음)
draft: boolean # 기본값 false, true면 빌드에서 제외
canonical: string # 절대 URL, 시리즈 canonical이나 크로스포스팅 시


# 자동 계산 (작성자가 넣지 않음)
# readingTime, wordCount, slug — build time에 자동 계산되어 PostDetail 타입으로 노출
---
```

## 필드별 검증 규칙

### title

- 60자 이내 (영문 기준, 한글은 40자 권장)
- 마침표·느낌표 등 종결 문장부호 금지
- 중복 금지 (전체 포스트에서 유니크) — 중복 시 SEO 악영향

### description

- 120~160자 (한글·영문 혼합 기준)
- title과 동일 문장 금지 (검색 스니펫 가치 저하)
- 명사형 종결 지양, "~하는 방법", "~의 원리" 같은 실용 표현 우선

### date / updated

- ISO 8601 Date 형식 (`YYYY-MM-DD`). 시간·타임존 금지.
- `updated`가 있으면 `date`보다 이후 날짜여야 함.
- RSS·sitemap에서 `lastmod`는 `updated || date` 우선순위.

### tags

- 3~5개 범위. 2개 이하는 분류 효과 낮고, 6개 이상은 관련성 희석.
- kebab-case, 영문 소문자, 숫자 허용 (예: `react-19`, `next-js`, `typescript`).
- 한글 태그 금지 (URL 인코딩 이슈).
- 기존 태그 재사용 우선. 새 태그 도입 시 `contents/` 전체에서 검색해 유사 태그 확인.

### series

- series.slug는 kebab-case.
- 동일 시리즈 내 order 중복 금지.
- 시리즈 첫 편은 order: 1, 결번 허용 (중간 편을 나중에 추가할 수 있음).

### cover

- src: 로컬 이미지는 `./images/` 하위 경로, CDN 이미지는 `https://` 절대 URL.
- alt는 시각 정보 없이 내용 이해 가능한 서술 (예: "React 19 use() 훅의 Suspense 통합 플로우 다이어그램").
- 이미지가 없으면 `cover` 필드 자체를 생략 — `/og` 라우트가 동적 OG 이미지 생성.

### draft

- 기본 false. true면 `next build` 결과에서 제외 (개발 중인 글 공유 금지).
- 발행 시점에 false로 변경 + `date` 갱신.

### canonical

- 시리즈 포스트나 다른 플랫폼 크로스포스팅 시 원본 URL 명시.
- 명시하지 않으면 Next.js가 `metadataBase + pathname`으로 자동 계산.

## 검증 예시

### 유효

```yaml
---
title: "React 19 use() 훅의 Suspense 통합"
description: "use()는 Promise를 직접 읽어 Suspense 경계와 자연스럽게 통합된다. 이 글은 use()의 동작 원리·제약·실전 패턴 3가지를 다룬다."
date: "2026-04-13"
tags: ["react", "react-19", "suspense"]
series:
  slug: "react-19-deep-dive"
  order: 2
cover:
  src: "./images/cover.png"
  alt: "React 19 use() 훅의 Suspense 통합 플로우 다이어그램"
draft: false
---
```

### 무효 (문제점 주석)

```yaml
---
title: "React 19 use 훅 알아보기!" # 종결 문장부호 금지
description: "use 훅 공부." # 120자 미만
date: "2026-04-13T12:00:00Z" # 시간·타임존 금지
tags: ["react"] # 2개 이하, 범위 미달
cover:
  src: "./images/cover.png"
  # alt 누락 — 필수 필드
draft: true # 발행 시점에는 false로
---
```

## TypeScript 스키마 (PostDetail)

빌드 타임에 MDX가 다음 타입으로 변환된다 (`src/features/posts/types/`):

```typescript
export type PostFrontmatter = {
	title: string;
	description: string;
	date: string; // ISO 8601
	updated?: string;
	tags: string[];
	series?: { slug: string; order: number };
	cover?: { src: string; alt: string };
	draft?: boolean;
	canonical?: string;
};

export type PostDetail = {
	slug: string; // 파일시스템에서 자동 추출
	frontmatter: PostFrontmatter;
	content: string; // MDX 원본
	readingTime: number; // 분 단위, 자동 계산
	wordCount: number; // 자동 계산
	toc: TocEntry[]; // 헤딩 트리, 자동 계산
};
```

Zod 스키마는 `src/features/posts/schemas/post-frontmatter.ts`에 정의 예정 (M2 단계).
