"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "../hooks/useTheme";

/**
 * light/dark 토글 버튼 — ADR-011.
 *
 * 테마 상태·전환 로직은 `useTheme` wrapper 훅에 위임. 이 컴포넌트는 프레젠테이션만 담당.
 * hydration 이전(`mounted: false`)에는 opacity-0 placeholder로 FOUC 차단 + 레이아웃 점프 방지.
 */
export function ThemeSwitcher() {
	const { resolvedTheme, toggleTheme, mounted } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={isDark ? "라이트 모드로 변경" : "다크 모드로 변경"}
			aria-pressed={isDark}
			className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			{mounted ? (
				isDark ? (
					<Sun className="size-5" aria-hidden />
				) : (
					<Moon className="size-5" aria-hidden />
				)
			) : (
				<Sun className="size-5 opacity-0" aria-hidden />
			)}
		</button>
	);
}
