---
description: Tailwind CSS 4 스타일링 규칙 — Canonical-first, arbitrary value 금지
paths: ["src/**/*.css", "src/**/*.tsx"]
---

# 스타일 컨벤션

## 전역 CSS

- 전역 CSS: `src/shared/styles/globals.css`
- 폰트: `next/font`로 로드 (`src/app/layout.tsx`의 `localFont`)
- Tailwind 4 + 우리 Semantic 토큰: `tokens.css` + `globals.css @theme inline` 매핑

## Tailwind 클래스 우선순위 (Canonical First)

**arbitrary value(`[..]`, `(--..)`) 사용 금지.** 표준 클래스 또는 우리 토큰을 활용해야 `suggestCanonicalClasses` Tailwind 워닝이 발생하지 않는다. 빌드는 통과해도 워닝은 회귀 신호.

### 금지 → 사용 매핑

| ❌ 금지                              | ✅ 사용                                                       |
| ------------------------------------ | ------------------------------------------------------------- |
| `max-w-[72rem]`                      | `max-w-content` (우리 토큰, =72rem) 또는 `max-w-6xl` (표준)   |
| `max-w-[44rem]`                      | `max-w-prose` (우리 토큰으로 오버라이드, =44rem)              |
| `border-(--color-border-subtle)`     | `border-border-subtle`                                        |
| `border-(--color-border-default)`    | `border-border` (shadcn alias)                                |
| `bg-[var(--color-background)]`       | `bg-background`                                               |
| `text-[var(--color-text-primary)]`   | `text-foreground`                                             |
| `text-[var(--color-text-secondary)]` | `text-muted-foreground` (shadcn alias)                        |
| `bg-[var(--color-bg-subtle)]`        | `bg-bg-subtle` (직접 토큰) 또는 `bg-secondary` (shadcn alias) |
| `z-[40]`                             | `z-40` (Tailwind 표준)                                        |
| `rounded-[0.5rem]`                   | `rounded-md` (=0.5rem 표준)                                   |
| `bg-[#fff]`                          | `bg-white` 또는 `bg-background`                               |

### 허용 우선순위 (위에서 아래로 검토)

1. **Tailwind 표준 클래스** — `max-w-6xl`·`z-40`·`text-sm`·`rounded-md`·`bg-white` 등
2. **우리 토큰 자동 생성 클래스** — `globals.css @theme inline`에 노출된 키:
   - 색: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border-subtle`, `bg-bg-default`, `text-text-secondary`, `bg-accent`, `bg-card`, `text-popover-foreground` 등
   - 컨테이너: `max-w-content` (72rem), `max-w-prose` (44rem)
   - 라운드: `rounded-xs/sm/md/lg/xl/full`
   - 그림자: `shadow-sm/md/lg`
3. **arbitrary value는 정말 일회성**일 때만 — 그 경우에도 워닝 발생. 같은 값이 2회+ 등장하면 토큰 추가가 더 나은 선택. PR 리뷰 거부 대상.

### 새 토큰이 필요할 때

특정 값이 반복적으로 등장하면 `tokens.css`에 Semantic 변수로 추가 + `globals.css @theme inline`에 노출. 예: `--container-narrow: 32rem;` → `max-w-narrow` 자동 사용 가능.

## CSS 파일 분리

- `tokens.css`: Semantic 변수 (light + `.dark` 오버라이드)
- `base.css`: reset
- `animations.css`: keyframes + View Transitions
- `prose.css`: MDX 본문 스코프 (`.prose`)
- `scrollbar.css`: 스크롤바 커스텀
- `shiki.css`: 코드블록 컨테이너
- `globals.css`: 위 모두 import + Tailwind `@theme inline` 매핑

## 회고

- M0-09~15에서 `max-w-[72rem]`·`max-w-[44rem]`·`border-(--color-border-subtle)` 등 arbitrary value 다수 발생 → 사용자 직접 리뷰에서 `suggestCanonicalClasses` 워닝 지적 → 본 룰로 명문화.
- VSCode Tailwind extension의 워닝은 즉시 변환 대상. 무시하지 말 것.
