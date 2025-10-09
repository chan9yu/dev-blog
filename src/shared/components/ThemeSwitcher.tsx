"use client";

import { useEffect, useState } from "react";

import { initTheme, setTheme, type Theme } from "../utils";

const SunIcon = () => (
	<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
);

const MoonIcon = () => (
	<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
		/>
	</svg>
);

type ThemeSwitcherProps = {
	/**
	 * Initial theme from server-side cookie
	 * Used to prevent icon flash on first render
	 */
	readonly initialTheme: Theme;
};

export function ThemeSwitcher({ initialTheme }: ThemeSwitcherProps) {
	const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme);

	useEffect(() => {
		// Sync with localStorage on client mount
		// This handles cases where localStorage differs from cookie
		const theme = initTheme();
		setCurrentTheme(theme);
	}, []);

	const handleToggle = () => {
		const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
		setCurrentTheme(nextTheme);
		setTheme(nextTheme);
	};

	const isDark = currentTheme === "dark";
	const label = isDark ? "Switch to light mode" : "Switch to dark mode";

	return (
		<button
			type="button"
			onClick={handleToggle}
			className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
			aria-label={label}
			title={label}
		>
			{isDark ? <SunIcon /> : <MoonIcon />}
		</button>
	);
}
