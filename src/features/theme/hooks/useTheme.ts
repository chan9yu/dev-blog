"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// next-themes wrapper: (1) useSyncExternalStore 기반 mounted로 hydration 이전 null 반환해 FOUC 차단,
// (2) View Transitions API progressive enhancement (미지원 브라우저는 즉시 apply).
export function useTheme() {
	const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();
	const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

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
