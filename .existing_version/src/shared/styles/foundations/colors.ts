/**
 * Design System - Color Foundation
 * blog9yu.dev 실제 사용 색상 기반 시스템
 *
 * 2025 Best Practice: Primitive → Semantic 2-Layer Architecture
 * 실제 서비스에서 사용 중인 색상을 추출하여 체계화
 */

/**
 * Primitive Colors
 * 원시 색상 팔레트 - Tailwind CSS 기본 팔레트 사용
 */
export const primitiveColors = {
	// Gray (Light Theme에서 사용)
	gray: {
		50: "#f9fafb", // bg-secondary (light)
		100: "#f3f4f6", // bg-tertiary (light)
		200: "#e5e7eb",
		300: "#d1d5db", // border-gray-300에서 사용
		400: "#9ca3af",
		500: "#6b7280",
		600: "#4b5563",
		700: "#374151",
		800: "#1f2937",
		900: "#111827"
	},

	// Slate (Light Theme 텍스트/배경)
	slate: {
		50: "#f8fafc", // bg-hover (light)
		100: "#f1f5f9", // border-secondary (light)
		200: "#e2e8f0", // border-primary (light), scrollbar-track
		300: "#cbd5e1",
		400: "#94a3b8", // scrollbar-thumb
		500: "#64748b", // text-tertiary (light), scrollbar-thumb-hover
		600: "#475569", // text-secondary (light)
		700: "#334155",
		800: "#1e293b",
		900: "#0f172a" // text-primary (light)
	},

	// Zinc (Dark Theme)
	zinc: {
		50: "#fafafa", // text-primary (dark)
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa", // text-secondary (dark)
		500: "#71717a", // text-tertiary (dark)
		600: "#52525b", // scrollbar-thumb (dark)
		700: "#3f3f46",
		800: "#27272a", // bg-tertiary (dark), border-primary (dark)
		900: "#18181b", // bg-secondary (dark), border-secondary (dark), scrollbar-track
		950: "#09090b" // bg-primary (dark)
	},

	// Stone (Dark Theme bg-hover)
	stone: {
		900: "#1c1917" // bg-hover (dark)
	},

	// Blue (Primary Brand Color)
	blue: {
		50: "#eff6ff",
		100: "#dbeafe",
		200: "#bfdbfe",
		300: "#93c5fd",
		400: "#60a5fa",
		500: "#3b82f6", // --color-primary
		600: "#2563eb", // --color-primary-hover
		700: "#1d4ed8",
		800: "#1e40af",
		900: "#1e3a8a"
	},

	// Indigo (Accent Color)
	indigo: {
		50: "#eef2ff",
		100: "#e0e7ff",
		200: "#c7d2fe",
		300: "#a5b4fc", // accent-hover (dark)
		400: "#818cf8", // accent (dark)
		500: "#6366f1", // accent (light)
		600: "#4f46e5", // accent-hover (light)
		700: "#4338ca",
		800: "#3730a3",
		900: "#312e81"
	},

	// Pure Colors
	white: "#ffffff",
	black: "#000000"
} as const;

/**
 * Semantic Colors
 * 의미론적 색상 - 실제 tokens.css에서 사용 중인 시맨틱 매핑
 */
export const semanticColors = {
	// Text Colors (Light/Dark 테마별로 사용)
	text: {
		primary: {
			light: primitiveColors.slate[900], // 15 23 42
			dark: primitiveColors.zinc[50] // 250 250 250
		},
		secondary: {
			light: primitiveColors.slate[600], // 71 85 105
			dark: primitiveColors.zinc[400] // 161 161 170
		},
		tertiary: {
			light: primitiveColors.slate[500], // 100 116 139
			dark: primitiveColors.zinc[500] // 113 113 122
		}
	},

	// Background Colors
	background: {
		primary: {
			light: primitiveColors.white, // 255 255 255
			dark: primitiveColors.zinc[950] // 9 9 11
		},
		secondary: {
			light: primitiveColors.gray[50], // 249 250 251
			dark: primitiveColors.zinc[900] // 24 24 27
		},
		tertiary: {
			light: primitiveColors.gray[100], // 243 244 246
			dark: primitiveColors.zinc[800] // 39 39 42
		},
		hover: {
			light: primitiveColors.slate[50], // 241 245 249
			dark: primitiveColors.stone[900] // 28 25 23
		}
	},

	// Border Colors
	border: {
		primary: {
			light: primitiveColors.slate[200], // 226 232 240
			dark: primitiveColors.zinc[800] // 39 39 42
		},
		secondary: {
			light: primitiveColors.slate[100], // 241 245 249
			dark: primitiveColors.zinc[900] // 24 24 27
		}
	},

	// Brand Colors
	primary: {
		light: primitiveColors.blue[500], // 59 130 246
		dark: primitiveColors.blue[500],
		hover: {
			light: primitiveColors.blue[600], // 37 99 235
			dark: primitiveColors.blue[600]
		}
	},

	accent: {
		light: primitiveColors.indigo[500], // 99 102 241
		dark: primitiveColors.indigo[400], // 129 140 248
		hover: {
			light: primitiveColors.indigo[600], // 79 70 229
			dark: primitiveColors.indigo[300] // 165 180 252
		}
	},

	// Scrollbar Colors
	scrollbar: {
		track: {
			light: primitiveColors.slate[200], // 226 232 240
			dark: primitiveColors.zinc[900] // 24 24 27
		},
		thumb: {
			light: primitiveColors.slate[400], // 148 163 184
			dark: primitiveColors.zinc[600] // 82 82 91
		},
		thumbHover: {
			light: primitiveColors.slate[500], // 100 116 139
			dark: primitiveColors.zinc[500] // 113 113 122
		}
	},

	// Pure Colors
	white: primitiveColors.white,
	black: primitiveColors.black
} as const;

/**
 * Color Tokens for Storybook
 * Storybook ColorPalette 컴포넌트용 객체 export
 */
export const colorTokens = {
	primitive: primitiveColors,
	semantic: semanticColors
} as const;

export type ColorScale = keyof typeof primitiveColors.gray;
export type SemanticColorKey = keyof typeof semanticColors;
