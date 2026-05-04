---
description: 다크모드 및 테마 전환 규칙
---

# 테마 컨벤션

- 클래스 기반 다크모드 (.dark), next-themes `enableColorScheme={false}`
- `color-scheme`은 CSS에서 `.dark` 클래스 기반으로 직접 선언 (inline style 아님)
- View Transitions API (`document.startViewTransition`)로 테마 전환 애니메이션
- `useSyncExternalStore`로 mounted 상태 감지 (hydration 안전)
