export const BADGE_RECENT_COUNT = 6;

export const BADGE_THEMES = ["dark", "light"] as const;
export type BadgeTheme = (typeof BADGE_THEMES)[number];

export const BADGE_CARD = {
	width: 480,
	thumbHeight: 270,
	height: 400
} as const;

type BadgePalette = { bg: string; title: string; muted: string; border: string };

export const BADGE_PALETTE: Record<BadgeTheme, BadgePalette> = {
	dark: { bg: "#0a0a0a", title: "#a5b4fc", muted: "#9ca3af", border: "#27272a" },
	light: { bg: "#ffffff", title: "#4f46e5", muted: "#6b7280", border: "#e5e7eb" }
};

export function isBadgeTheme(value: string): value is BadgeTheme {
	return (BADGE_THEMES as readonly string[]).includes(value);
}

export function parseBadgeIndex(raw: string): number | null {
	if (!/^\d+$/.test(raw)) return null;
	const index = Number(raw);
	if (index >= BADGE_RECENT_COUNT) return null;
	return index;
}
