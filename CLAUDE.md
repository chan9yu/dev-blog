# chan9yu 개발 블로그

프론트엔드 엔지니어를 위한 1인 저자 기술 블로그.

## Stack

Next.js 16 App Router · React 19 (Compiler) · TypeScript 6 strict · Tailwind CSS 4 · shadcn/ui · lucide-react · next-themes

## Architecture

3-Layer: `app/` (라우팅·조립) → `features/` (9개 도메인 모듈) → `shared/` (범용). Feature 간 직접 import 금지.

```
src/app/         — 라우팅, metadata, providers
src/features/    — posts, tags, series, search, views, comments, theme, lightbox, about
src/shared/      — components, ui(shadcn), styles, seo, config, utils, hooks, types, modules
contents/        — MDX 콘텐츠 (Git Submodule, 루트)
```

## Commands

```bash
pnpm dev          # 개발 서버 (port 3100)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
pnpm format       # Prettier 포매팅
pnpm test         # Vitest (Unit + Integration)
pnpm test:e2e     # Playwright E2E
```

## Key Decisions

- SSG-first. 런타임 CMS·서버 검색·클라이언트 캐시(TanStack Query) 도입하지 않음
- TDD (Red→Green→Refactor) + Testing Trophy (Integration ~60%)
- Page-First Skeleton: M1에서 더미 데이터로 전 페이지 UI 완성 후 단계적 실데이터 교체

## Progressive Disclosure

작업에 필요한 상세 문서를 아래에서 찾아 읽을 것. 모든 정보를 한번에 읽지 말고 현재 태스크에 관련된 문서만 참조.

| 문서                    | 용도                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `docs/TASKS.md`         | 현재 진행할 태스크 체크리스트 (M0~M7)                         |
| `docs/ROADMAP.md`       | 태스크별 상세 — 대응 ID, 검증 기준, Entry/Exit                |
| `docs/PRD_PRODUCT.md`   | 제품 스펙 — FEAT, US, 성공 지표, 비목표                       |
| `docs/PRD_TECHNICAL.md` | 기술 계약 — MOD, RT, ADR, 데이터 모델, 마일스톤               |
| `.claude/rules/*.md`    | 코드 작성 규약 (아키텍처·React·TS·테마·접근성·테스트 등 10종) |
