"use client";

import { useEffect, useState } from "react";

import MoonIcon from "@/assets/icons/moon.svg";
import SunIcon from "@/assets/icons/sun.svg";

import { initTheme, setTheme, type Theme } from "../utils";

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
			{isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
		</button>
	);
}
