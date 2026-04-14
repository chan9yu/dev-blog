# MDX 콘텐츠 규약

블로그 포스트(MDX) 작성 시 반드시 준수한다. content-engineer·seo-auditor가 이 규약을 기준으로 초안을 작성·검수한다.

## 파일 경로 & 구조

- 포스트 경로: `contents/posts/{slug}/index.mdx` — slug는 kebab-case, 영문 소문자+숫자만 (예: `react-19-use-hook`)
- 첨부 이미지: `contents/posts/{slug}/images/` 하위. 코드블록 외의 자산은 포스트 디렉토리에 격리.
- 시리즈 포스트: frontmatter의 `series.slug`를 공유. 포스트 파일 자체는 `contents/posts/{slug}/` 독립 배치.

## Frontmatter 필수 필드

```yaml
---
title: "React 19 use() 훅 완벽 이해" # 60자 이내 권장
description: "use() 훅의 동작 원리와 Suspense 통합..." # 120~160자, 검색 스니펫에 직접 노출됨
date: "2026-04-13" # ISO 8601, 발행일
updated: "2026-04-15" # 선택, 수정 시 필수
tags: ["react", "react-19", "suspense"] # 3~5개, kebab-case, 영문
series: # 선택
  slug: "react-19-deep-dive"
  order: 2
thumbnail: "/posts/react-19-use-hook/images/thumbnail.png" # 선택, OG 이미지·카드 썸네일용. `/posts/{slug}/images/*` 평탄 문자열. alt 텍스트는 렌더 시점에 frontmatter.title 재사용 (별도 필드 없음).
draft: false # true면 빌드에서 제외
---
```

**Why:** frontmatter는 SSG 빌드·RSS·sitemap·OG 라우트의 단일 진실 공급원이다. 누락은 런타임 에러가 아니라 **빌드 실패**로 이어진다.

## 본문 작성

- **첫 단락**: 150자 이내, "이 글이 누구에게·무엇을·왜 유용한지" 3요소 포함. description과 중복 금지.
- **Heading 계층**: `#`은 frontmatter.title이 자동 사용하므로 본문은 `##`부터 시작. 건너뛰기 금지(`##` 다음에 `####` 금지).
- **코드블록**: 반드시 언어 태그 명시 (` ```tsx `, ` ```bash `). 3줄 이상 코드는 파일 경로 메타 추가 (` ```tsx title="app/page.tsx" `).
- **인라인 코드**: 함수명·타입명·파일 경로는 `code` 감싸기. 일반 영단어는 감싸지 않음.
- **이미지**: `![대체텍스트](경로)` 형식 필수, alt 누락은 a11y-auditor가 블록. 장식용 이미지는 `alt=""`로 명시.
- **링크**: 외부 링크는 가능하면 출처·날짜 병기. 공식 문서 우선, 블로그 인용은 최소화.

## 금지 규칙

- 기술적으로 **검증되지 않은 주장 금지** — "보통", "대부분" 같은 추정어는 근거 있는 통계로 교체하거나 삭제.
- **AI 글투 금지** — "~일 수 있습니다", "~를 고려해볼 수 있습니다" 같은 모호 어미는 단정형으로 교체.
- **이모지 본문 사용 금지** (사용자 명시 요청 제외). heading·버튼 UI 제외.
- **Placeholder 코드 금지** — `// ... 기존 로직` 같은 생략 표기 없이 완전히 실행 가능한 예시만.

## 코드 예시 품질 기준

- 프로젝트의 실제 스택(Next.js 16, React 19, TS 6, Tailwind 4) 기준. 이전 버전 API 사용 시 deprecation 명시.
- strict mode 통과 — `any` 없음, 리턴 타입 추론 가능.
- 실행 가능한 최소 예시 + "실전 확장 포인트" 분리 설명.

## 검수 파이프라인

1. content-engineer 초안 → `_workspace/content_{slug}_draft.md`
2. seo-auditor: frontmatter·description·OG·slug 검증
3. a11y-auditor: heading 계층·이미지 alt·링크 컨텍스트 검증
4. react-nextjs-code-reviewer: 코드블록 기술 정확성 검증
5. 빌드 확인: `pnpm build` 성공 확인 → 통과 시 `contents/posts/{slug}/index.mdx`에 저장
