# Project Context — blog-dev Orchestrator

`blog-dev` 오케스트레이터가 의사결정에 참조하는 프로젝트 컨텍스트.

## 프로젝트 정체성

- **chan9yu 개발 블로그** — 1인 저자 기술 블로그
- **핵심 가치**: "정확한 기술 문서가 독자의 다음 한 걸음을 만든다" (PRD_PRODUCT.md)
- **3 Personas**: 미드 시니어 개발자 / 주니어·취준생 / 저자 자신
- **목표**: 단기 20편, 중기 월 2K UV, 장기 검색 유입 50%

## 기술 스택

| 레이어        | 기술                               | 버전   | 특이사항                       |
| ------------- | ---------------------------------- | ------ | ------------------------------ |
| Framework     | Next.js                            | 16.2.3 | App Router, Edge Runtime `/og` |
| UI Runtime    | React                              | 19.2.5 | React Compiler 활성            |
| Language      | TypeScript                         | 6.0.2  | strict mode                    |
| Styling       | Tailwind CSS                       | 4.2.2  | @theme 블록, CSS 변수          |
| UI Primitives | shadcn/ui                          | latest | 복사 모델, kebab-case          |
| Type Safety   | Zod                                | (M2+)  | frontmatter·API                |
| Testing       | Vitest + Playwright                | (M2+)  | 테스팅 트로피                  |
| Quality       | ESLint 9 + Prettier 3 + Lefthook 2 | —      | pre-commit 자동                |

## 9개 Feature 도메인

모든 도메인은 `src/features/{name}/` 하위에 `components/`, `hooks/`, `services/`, `schemas/`, `types/`, `constants/`, `utils/`, `config/`, `index.ts` 구조.

| 도메인       | 역할                          | 주요 태스크                 |
| ------------ | ----------------------------- | --------------------------- |
| **posts**    | 포스트 목록·상세·TOC·관련     | M0-17~18, M1-06, M2-_, M3-_ |
| **tags**     | 태그 허브·상세·칩·트렌딩      | M0-19~20, M1-07             |
| **series**   | 시리즈 허브·상세·네비         | M0-21~22, M1-08             |
| **search**   | Fuse.js + ⌘K 모달             | M0-_, M1-09, M4-_           |
| **views**    | Vercel KV + `/api/views`      | M0-29, M5-\*                |
| **comments** | Giscus iframe                 | M6-\*                       |
| **theme**    | light/dark + View Transitions | M0-31, M7-\*                |
| **lightbox** | 이미지 확대                   | M5-\*                       |
| **about**    | 저자 소개                     | M0-23                       |

## 3 Laws (아키텍처 불변식)

1. **app → features → shared 단방향 의존** (역방향 금지)
2. **shared는 features를 모름** (타입도 features를 참조하지 않음)
3. **feature 간 직접 import 금지** (필요 시 public API 또는 shared로 승격)

## 라우팅 쉘 (RT-\* 14종)

```
/                         홈
/posts                    포스트 목록
/posts/[slug]             포스트 상세
/tags                     태그 허브
/tags/[tag]               태그 상세
/series                   시리즈 허브
/series/[slug]            시리즈 상세
/about                    소개
/rss                      RSS Route Handler
/sitemap.xml              Sitemap
/robots.txt               Robots
/manifest.webmanifest     PWA manifest
/og                       Edge Route (OG 이미지)
/api/views                Route Handler (조회수)
```

## 마일스톤 요약

| 마일스톤 | 기간  | 핵심 목표                                   | Exit 기준                               |
| -------- | ----- | ------------------------------------------- | --------------------------------------- |
| **M0**   | 1주   | 디자인 토큰·레이아웃·라우팅 쉘              | `pnpm dev`에서 RT-\* 14종 404 없이 렌더 |
| **M1**   | 2~3주 | 더미 데이터 기반 모든 FEAT-\* UI            | 네비게이션 흐름 완결                    |
| **M2**   | —     | 콘텐츠 파이프라인 (MDX + contentlayer 대체) | MDX 컴파일, PostDetail 타입             |
| **M3**   | —     | 검색 (Fuse.js 인덱스)                       | ⌘K 모달, 결과 렌더                      |
| **M4**   | —     | 조회수 (Vercel KV)                          | `/api/views` Rate limit                 |
| **M5**   | —     | 라이트박스·코드블록·TOC 고도화              | —                                       |
| **M6**   | —     | 댓글 (Giscus)                               | —                                       |
| **M7**   | —     | 폴리시·성능·SEO 점검                        | Lighthouse > 90                         |

현재 **M0 진행 중** (2026-04-13 기준).

## 팀 구성 상세 매트릭스

### Feature 트랙 세부 조합

| 태스크 유형           | 필수 팀원                                                           | 선택 팀원                                    |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| UI 컴포넌트 신규      | nextjs-markup-specialist + compound-reviewer + a11y-auditor         | nextjs-test-engineer (컴포넌트 로직 복잡 시) |
| 페이지 라우팅 (RT-\*) | nextjs-app-router-expert + compound-reviewer + boundary-mismatch-qa | nextjs-markup-specialist (UI 포함 시)        |
| 서비스 로직           | nextjs-app-router-expert + compound-reviewer + nextjs-test-engineer | —                                            |
| 스키마·타입           | nextjs-app-router-expert + compound-reviewer + boundary-mismatch-qa | —                                            |
| 유틸리티 (shared)     | nextjs-app-router-expert + compound-reviewer + nextjs-test-engineer | —                                            |
| 디자인 토큰·스타일    | nextjs-markup-specialist + compound-reviewer                        | —                                            |
| 인프라 (config·설정)  | nextjs-app-router-expert + compound-reviewer                        | prd-tech-validator (아키텍처 영향 시)        |

### 트랙 혼합 규칙

- 한 세션에서 여러 트랙 요청 시: **순차 실행** (병렬 금지 — 팀 모드 1팀 제약)
- 각 트랙 완료 후 팀 해체 → 다음 트랙 팀 구성
- 공통 산출물은 `_workspace/`에서 공유

## PRD·ROADMAP 연계 키

- **MOD-\*** : PRD_TECHNICAL.md의 모듈 ID (예: MOD-posts-services)
- **RT-\*** : 라우팅 쉘 14종
- **FEAT-\*** : PRD_PRODUCT.md의 기능 ID
- **US-\*** : User Story
- **ADR-\*** : Architectural Decision Record

Orchestrator는 사용자 요청이 ID 패턴과 매칭되면 해당 문서의 섹션을 우선 참조.

## MCP 서버 활용 지침

| MCP                 | 활용 시점                                                            |
| ------------------- | -------------------------------------------------------------------- |
| context7            | React 19·Next.js 16·Tailwind 4 최신 API 확인 (훈련 데이터 의존 금지) |
| serena              | 심볼 기반 리팩토링, 참조 추적, 컴파운드 사이클 REVIEW 보조           |
| shadcn              | UI 컴포넌트 추가·업데이트 (`src/shared/components/ui/`)              |
| playwright          | milestone-gate의 라우팅·네비 검증, M1+ 스크린샷                      |
| sequential-thinking | 아키텍처 설계·복잡한 디버깅 단계 분해                                |

## 자율 범위 요약 (autonomy.md)

- **자율 실행**: `src/` 코드, 테스트, `_workspace/`, TASKS 체크박스, CHANGELOG
- **확인 필수**: `package.json`, `next.config.ts`, `.claude/rules/`, `.claude/agents/`, `docs/PRD_*`, Git 쓰기

## 오케스트레이터 의사결정 힌트

- **빠른 결정이 필요한 경우** (단순 유틸·디자인 토큰): PLAN을 최소화(prd-tech-validator 생략) + EXECUTE·REVIEW만
- **영향 범위가 큰 경우** (공개 API·아키텍처): PLAN 단계에서 prd-tech-validator 반드시 투입
- **빌드가 자주 깨지는 경우**: GC를 선제적으로 실행해 기술 부채 정화 후 진행
