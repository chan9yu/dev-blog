"use client";

import { useState } from "react";

import MoonIcon from "@/shared/assets/icons/moon.svg";
import SunIcon from "@/shared/assets/icons/sun.svg";
import { initTheme, setTheme, type Theme } from "@/shared/utils";

type ThemeSwitcherProps = {
	/**
	 * Initial theme from server-side cookie
	 * Used to prevent icon flash on first render
	 */
	readonly initialTheme: Theme;
};

export function ThemeSwitcher({ initialTheme }: ThemeSwitcherProps) {
	const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return initialTheme;
		return initTheme();
	});

	const handleToggle = () => {
		const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

		const applyTheme = () => {
			setCurrentTheme(nextTheme);
			setTheme(nextTheme);
		};

		// Use View Transitions API if supported
		if (document.startViewTransition) {
			const transition = document.startViewTransition(applyTheme);
			// DOM 업데이트가 완료된 후 custom event 발생
			transition.updateCallbackDone.then(() => {
				window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: nextTheme } }));
			});
		} else {
			// Fallback for browsers that don't support View Transitions
			applyTheme();
			// 즉시 custom event 발생
			window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: nextTheme } }));
		}
	};

	const isDark = currentTheme === "dark";
	const label = isDark ? "Switch to light mode" : "Switch to dark mode";

	return (
		<button
			type="button"
			onClick={handleToggle}
			className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
			aria-label={label}
			title={label}
		>
			{isDark ? (
				<SunIcon className="size-5 sm:size-6" aria-hidden="true" />
			) : (
				<MoonIcon className="size-5 sm:size-6" aria-hidden="true" />
			)}
		</button>
	);
}
