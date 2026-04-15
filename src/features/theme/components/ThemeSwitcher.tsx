"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

/**
 * light/dark 토글 버튼.
 * 클라이언트 mount 상태는 `useSyncExternalStore`로 감지 (react.md 룰: setState-in-effect 금지).
 * M3에서 View Transitions API 기반 애니메이션 + useTheme wrapper로 확장 예정.
 */
const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

	const isDark = mounted && resolvedTheme === "dark";

	const handleToggle = () => {
		const nextTheme = isDark ? "light" : "dark";
		const applyTheme = () => setTheme(nextTheme);

		if (document.startViewTransition) {
			document.startViewTransition(applyTheme);
		} else {
			applyTheme();
		}
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
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
