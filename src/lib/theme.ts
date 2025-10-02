export const THEME_STORAGE_KEY = "theme" as const;
export const THEME_COOKIE_MAX_AGE = 31536000; // 1 year in seconds

export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	return stored === "dark" || stored === "light" ? stored : null;
}

export function applyTheme(theme: Theme): void {
	document.documentElement.classList.toggle("dark", theme === "dark");
}

export function persistTheme(theme: Theme): void {
	localStorage.setItem(THEME_STORAGE_KEY, theme);
	document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function setTheme(theme: Theme): void {
	applyTheme(theme);
	persistTheme(theme);
}

export function initTheme(): Theme {
	const stored = getStoredTheme();
	if (stored) {
		setTheme(stored);
		return stored;
	}

	const system = getSystemTheme();
	setTheme(system);
	return system;
}
