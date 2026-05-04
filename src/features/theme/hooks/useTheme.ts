"use client";

import { useTheme as useNextTheme } from "next-themes";

import { useHydrated } from "@/shared/hooks/useHydrated";

type Theme = "light" | "dark";

// next-themes wrapper: hydration 이전 null 반환으로 FOUC 차단 + View Transitions API progressive enhancement.
export function useTheme() {
	const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();
	const mounted = useHydrated();

	const currentTheme: Theme | null = mounted ? (resolvedTheme === "dark" ? "dark" : "light") : null;

	const applyWithTransition = (theme: Theme) => {
		const apply = () => setNextTheme(theme);

		if (typeof document !== "undefined" && typeof document.startViewTransition === "function") {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	};

	const toggleTheme = () => {
		if (!mounted || currentTheme === null) return;
		applyWithTransition(currentTheme === "dark" ? "light" : "dark");
	};

	return {
		resolvedTheme: currentTheme,
		toggleTheme,
		setTheme: applyWithTransition,
		mounted
	};
}
