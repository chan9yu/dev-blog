# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **[M0-01]** Primitive/Semantic 색상 팔레트를 `src/shared/styles/tokens.css`에 CSS-only로 일원화 — light 기본 + `.dark` 오버라이드, `color-scheme` 직접 선언 (ADR-011). 별도 TS 팔레트 파일을 두지 않음 (SSOT = CSS, Tailwind 4 철학 준수).
- **[M0-02]** Typography 스케일을 `src/shared/styles/globals.css` `@theme inline`에 CSS-first로 정의 — Display/H1~H4/BodyLg/Body/BodySm/Label/Caption 10단계. Tailwind 4 `--text-*--line-height` 수정자 문법을 사용해 `text-display`, `text-h1`, `text-body` 등 유틸 하나에 size + line-height + font-weight + letter-spacing을 한꺼번에 적용.
- **[M0-03]** Semantic CSS 변수 토큰 — Surface·Text·Border·Accent·Feedback·Code·Focus·Shadow·Radius·Container·Z-index 범주 모두 `tokens.css` `:root` + `.dark` 쌍으로 정의.
- **[M0-04]** 기반 스타일 파일 — `base.css` (reset·focus·prefers-reduced-motion), `animations.css` (fade/scale/slide keyframes + View Transitions), `prose.css` (MDX 본문), `scrollbar.css`, `shiki.css` (코드블록 컨테이너).
- **[M0-05]** Tailwind CSS 4 `@theme inline` 블록에 Semantic 토큰 연결 (`src/shared/styles/globals.css`) — `bg-*`, `text-*`, `border-*`, `shadow-*`, `rounded-*`, `animate-*` 유틸이 토큰 변수 기반으로 작동.
- **[M0-06]** `cn()` 유틸 (`src/shared/utils/cn.ts`) — `clsx` + `tailwind-merge` 조합. shadcn/ui 표준 패턴.

- **[M0-07]** Pretendard Variable 폰트 설정 확인 (`src/app/layout.tsx`) — `next/font/local`의 `localFont` 사용, `--font-pretendard` CSS 변수, `display: swap`, weight 45~920, Apple SD Gothic Neo·Malgun Gothic fallback.
- **[M0-08]** `lucide-react` 아이콘 라이브러리 도입 — `.claude/rules/icons.md` 규칙 문서 신규 추가 (lucide-react 단일화 원칙, 커스텀 브랜드 SVG는 `src/shared/assets/icons/*.svg`, svgr 설정은 실제 첫 커스텀 SVG 시점에 지연 도입).

### Dependencies

- `clsx` (prod) — 조건부 className 결합.
- `tailwind-merge` (prod) — 충돌 Tailwind 유틸 뒤쪽 우선 해결.
- `lucide-react` (prod) — 단일화된 아이콘 라이브러리.

[Unreleased]: https://github.com/chan9yu/dev-blog/compare/main...develop
