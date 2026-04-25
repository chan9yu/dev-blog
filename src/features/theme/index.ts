/**
 * MOD-theme Public API — PRD_TECHNICAL §7.7 + ADR-011
 *
 * - Components: ThemeSwitcher — light/dark 토글 버튼
 * - Hooks: useTheme — next-themes wrapper (mounted 감지 + View Transitions progressive enhancement)
 *
 * ThemeProvider 조립은 여전히 `app/providers.tsx`에서 next-themes 직접 소비.
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { ThemeSwitcher } from "./components";
export { useTheme } from "./hooks";
