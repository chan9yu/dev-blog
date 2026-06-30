import { readFileSync } from "node:fs";
import { join } from "node:path";

export const BADGE_RECENT_COUNT = 6;

export const BADGE_THEMES = ["dark", "light"] as const;
export type BadgeTheme = (typeof BADGE_THEMES)[number];

export const BADGE_CARD = {
	width: 480,
	thumbHeight: 270,
	height: 440
} as const;

export const BADGE_CACHE_CONTROL = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

type BadgePalette = { bg: string; title: string; muted: string; border: string };

export const BADGE_PALETTE: Record<BadgeTheme, BadgePalette> = {
	dark: { bg: "#0a0a0a", title: "#a5b4fc", muted: "#9ca3af", border: "#27272a" },
	light: { bg: "#ffffff", title: "#4f46e5", muted: "#6b7280", border: "#e5e7eb" }
};

export function isBadgeTheme(value: string): value is BadgeTheme {
	return (BADGE_THEMES as readonly string[]).includes(value);
}

export function parseBadgeIndex(raw: string) {
	if (!/^\d+$/.test(raw)) return null;
	const index = Number(raw);
	if (index >= BADGE_RECENT_COUNT) return null;
	return index;
}

const BADGE_FONT_DIR = join(process.cwd(), "public", "fonts");

// 빌드 타임 전용. ImageResponse(next/og) 내부 Satori 엔진은 정적 ttf/otf/woff만 지원
// — variable woff2(PretendardVariable)는 못 읽어 한글이 깨지므로 정적 OTF를 별도 로드.
export function loadBadgeFonts() {
	return [
		{
			name: "Pretendard" as const,
			weight: 400 as const,
			style: "normal" as const,
			data: readFileSync(join(BADGE_FONT_DIR, "Pretendard-Regular.otf"))
		},
		{
			name: "Pretendard" as const,
			weight: 700 as const,
			style: "normal" as const,
			data: readFileSync(join(BADGE_FONT_DIR, "Pretendard-Bold.otf"))
		}
	];
}
