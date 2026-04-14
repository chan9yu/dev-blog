/**
 * MOD-theme Public API — PRD_TECHNICAL §7.7
 *
 * 현재(M1): 뼈대. 공개 타입 없음 (Theme = "light" | "dark"는 M3 구현 시 feature 내부 types.ts에서 정의).
 *
 * 향후 추가 (PRD §7.7 계약):
 * - 컴포넌트 (M1-56, M3-13~M3-14): ThemeSwitcher. ThemeProvider는 현재 app/providers.tsx에서 next-themes 직접 호출 중이므로 Provider가 2개 이상 되는 시점(M3+)에 이쪽으로 이관.
 * - 훅 (M3-14): useTheme (next-themes 래퍼)
 * - 타입: Theme
 *
 * 기반: next-themes (ADR-011). 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export {};
