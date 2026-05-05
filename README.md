# chan9yu's dev blog

Next.js 16 App Router와 MDX 기반으로 구축된 개인 개발 블로그입니다.
<br />
Git 서브모듈로 컨텐츠를 관리하며 SSG(Static Site Generation) 방식으로 최적화된 성능을 제공합니다.

[![Release](https://img.shields.io/github/v/release/chan9yu/dev-blog?logo=github&color=blue)](https://github.com/chan9yu/dev-blog/releases/latest)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-orange?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Stack

- **Framework**: Next.js 16 App Router (Turbopack 빌드, React Compiler 활성)
- **UI Runtime**: React 19
- **Language**: TypeScript 6 (strict mode)
- **Styling**: Tailwind CSS 4 · shadcn/ui · next-themes
- **Icons**: lucide-react
- **Content**: MDX (Git Submodule `contents/`) · Shiki 코드 하이라이팅
- **Type Safety**: Zod (frontmatter·API runtime validation)
- **Testing**: Vitest · React Testing Library · MSW · Playwright
- **Runtime**: Vercel KV (`/api/views` 조회수, fail-soft fallback)
- **Quality**: ESLint 9 · Prettier 3 · Lefthook 2

---

## Architecture

3-Layer (`app → features → shared` 단방향):

```
src/
├── app/         — 라우팅, metadata, providers
├── features/    — 9개 도메인 (posts, tags, series, search, views, comments, theme, lightbox, about)
└── shared/      — components, ui(shadcn), styles, seo, config, utils, hooks, types, modules

contents/        — MDX 콘텐츠 (Git Submodule)
docs/            — PRD, ROADMAP, TASKS, AI_WORKFLOW_GUIDE
.claude/         — AI 에이전트 하네스 (agents, skills, rules, commands, hooks)
```

**3 Laws** (`.claude/rules/project-structure.md`):

1. `app → features → shared` 단방향 의존 (역방향 금지)
2. `shared`는 `features`를 모름
3. feature 간 직접 import 금지 — `app/`에서 조립 또는 `shared/`로 승격

---

## Commands

```bash
pnpm dev          # 개발 서버 (port 3100)
pnpm build        # 프로덕션 빌드 (Turbopack)
pnpm lint         # ESLint
pnpm format       # Prettier 포매팅
pnpm test         # Vitest (Unit + Integration)
pnpm test:e2e     # Playwright E2E (5 spec)
```

포트: 개발 서버는 **3100** (Next.js 기본 3000이 아님).

---

## Key Decisions

- **SSG-first** — 런타임 CMS·서버 검색·클라이언트 캐시(TanStack Query) 도입하지 않음. 유일한 런타임 API는 `/api/views`(Vercel KV).
- **TDD** (Red→Green→Refactor) + Testing Trophy (Integration ~60%)
- **Page-First Skeleton** — M1에서 더미 데이터로 전 페이지 UI 완성 후 단계적 실데이터 교체
- **콘텐츠는 Git Submodule** — `contents/` 저장소 분리로 소스와 글의 커밋 이력 독립
- **한글 slug 영역별 분리** — 포스트는 영문 강제(도구·CDN 호환), 태그·시리즈는 한글 허용 + 공백→hyphen 정규화
- **Fail-soft 조회수** — KV 미설정/장애 시 GET=0, POST=silent skip (페이지 500 차단)

---

## 문서 (Progressive Disclosure)

| 문서                        | 용도                                        |
| --------------------------- | ------------------------------------------- |
| `docs/TASKS.md`             | M0~M7 태스크 체크리스트 (199/199 완료)      |
| `docs/ROADMAP.md`           | 마일스톤별 상세 — 검증 기준, Entry/Exit     |
| `docs/PRD_PRODUCT.md`       | 제품 스펙 — FEAT, US, 성공 지표             |
| `docs/PRD_TECHNICAL.md`     | 기술 계약 — MOD, RT, ADR, 데이터 모델       |
| `docs/AI_WORKFLOW_GUIDE.md` | Claude Code 멀티 에이전트 하네스 동작 원리  |
| `CLAUDE.md`                 | Claude Code 온보딩 · Progressive Disclosure |

---

## AI 개발 워크플로우

이 프로젝트는 **Claude Code 기반 컴파운드 엔지니어링 하네스**를 갖추고 있다.
<br />
사용자가 자연어로 요청하면 내부에서 전문 에이전트 팀이 자동 구성되어 6단계 품질 사이클을 돈다.

```
"M0-01 진행해줘"
  → blog-dev 스킬 트리거
  → TeamCreate (Feature 트랙 팀 구성)
  → PLAN → EXECUTE → REVIEW(핑퐁 3회) → VALIDATE → DOCUMENT → SYNTHESIZE
  → 사용자 보고 (변경 파일·사이클 통계·빌드 결과)
```

### 4개 트랙

| 트랙        | 트리거 예시                            |
| ----------- | -------------------------------------- |
| **Feature** | `M0-06 진행`, `검색 기능 만들어줘`     |
| **Content** | `React 19 use 훅 포스트 초안`          |
| **GC**      | `Week 0 GC`, `청소해줘`, `하네스 평가` |
| **Docs**    | `TASKS 체크 맞춰줘`, `ROADMAP 진행률`  |

### 구성 자산

- **15개 에이전트** (`orchestration` · `developer` · `planning` · `quality` · `content` · `documentation`)
- **15개 스킬** (오케스트레이션 3 · 도메인 작업 4 · 참조 지식 8 — `ai-seo`·`programmatic-seo`·`seo-audit` 추가)
- **17개 규칙** (아키텍처·스타일·품질·하네스·아이콘·REVIEW 강제·No-Fallback·Comments)
- **9개 슬래시 커맨드** (수동 단일 작업용)

상세 동작은 [`docs/AI_WORKFLOW_GUIDE.md`](./docs/AI_WORKFLOW_GUIDE.md) 참조.

### 자율 범위

- **자동**: `src/` 코드, 테스트, `docs/TASKS.md` 체크박스, `CHANGELOG.md`
- **사용자 승인 필수**: 의존성 추가(`package.json`)·아키텍처 변경·PRD 수정·Git 쓰기 작업

### Git 브랜치 전략 (Git Flow Lite)

```
main       ← 프로덕션 릴리스 (보호)
develop    ← 기본 통합 브랜치 (모든 feature PR의 base)
feature/M{n}-{슬러그}  ← 마일스톤 단위 개발
```

**1 마일스톤 = 1 feature 브랜치**.
<br />
새 마일스톤 첫 태스크 진입 시 orchestrator가 리모트 최신 `develop`으로부터 `feature/M{n}-*` 브랜치 생성을 제안한다 (사용자 승인 후 실행).
<br />
마일스톤 완료 시 `develop`으로 PR, squash merge.

---

## 개발 시작

```bash
# 의존성 설치 + 서브모듈 (contents) 초기화
git clone --recurse-submodules https://github.com/chan9yu/dev-blog.git
cd dev-blog
pnpm install

# 개발 서버
pnpm dev
# → http://localhost:3100

# 프로덕션 빌드 테스트
pnpm build
```

---

## 배포

[**chan9yu.dev**](https://chan9yu.dev) — Vercel 자동 배포 (`main` 머지 → 프로덕션, `develop` PR → Preview).

- Framework Preset: Next.js
- Build Command: `pnpm build` (Turbopack)
- Output: `.next/`
- Environment Variables (선택, 조회수 활성화 시):
  - `KV_REST_API_URL`, `KV_REST_API_TOKEN` — `@vercel/kv` 자동 인식
  - 미설정 시 빌드·렌더 정상 동작, 조회수만 `0`으로 표시
- 품질 게이트: 로컬 `lefthook` pre-commit (Prettier · ESLint · tsc) + Vercel 빌드 시 typecheck

---

## License

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
