/**
 * MOD-theme Public API — PRD_TECHNICAL §7.7
 *
 * 현재(M1): ThemeSwitcher — next-themes 기반 light/dark 토글.
 *
 * 향후:
 * - M3-14: useTheme wrapper (next-themes 래핑 + View Transitions)
 * - Theme 타입 ("light" | "dark")은 feature 내부 types.ts에서 M3에 정의.
 *
 * 규칙: ThemeProvider는 현재 app/providers.tsx에서 next-themes 직접 호출. Provider 2+ 시점(M3)에 여기로 이관.
 */

export { ThemeSwitcher } from "./components";
