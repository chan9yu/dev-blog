/**
 * Design System - Typography Foundation
 * blog9yu.dev 타이포그래피 시스템
 *
 * 2025 Best Practice: Semantic Token Architecture
 * tokens.css에 정의된 시맨틱 토큰을 기반으로 체계화
 */

/**
 * Font Families
 */
export const fontFamilies = {
	sans: "var(--font-pretendard)",
	mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
} as const;

/**
 * Font Sizes
 * Display, Heading, Body, Label 카테고리로 구분
 */
export const fontSizes = {
	// Display - 큰 제목용 (Hero, Landing)
	display: {
		lg: "3.75rem", // 60px
		md: "3rem", // 48px
		sm: "2.25rem" // 36px
	},
	// Heading - 일반 제목용 (H1-H6)
	heading: {
		xl: "2rem", // 32px
		lg: "1.5rem", // 24px
		md: "1.25rem", // 20px
		sm: "1.125rem", // 18px
		xs: "1rem" // 16px
	},
	// Body - 본문 텍스트용
	body: {
		lg: "1.125rem", // 18px
		md: "1rem", // 16px
		sm: "0.875rem", // 14px
		xs: "0.75rem" // 12px
	},
	// Label - 라벨/캡션용
	label: {
		lg: "0.875rem", // 14px
		md: "0.75rem", // 12px
		sm: "0.6875rem" // 11px
	}
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700
} as const;

/**
 * Line Heights
 */
export const lineHeights = {
	tight: 1.25,
	snug: 1.375,
	normal: 1.5,
	relaxed: 1.625,
	loose: 2
} as const;

/**
 * Letter Spacing
 */
export const letterSpacings = {
	tighter: "-0.05em",
	tight: "-0.025em",
	normal: "0em",
	wide: "0.025em",
	wider: "0.05em"
} as const;

/**
 * Typography Styles
 * 사전 정의된 타이포그래피 조합 (Size + Weight + Line Height + Letter Spacing)
 */
export const typographyStyles = {
	// Display Styles
	display: {
		lg: {
			fontSize: fontSizes.display.lg,
			fontWeight: fontWeights.bold,
			lineHeight: lineHeights.tight,
			letterSpacing: letterSpacings.tight
		},
		md: {
			fontSize: fontSizes.display.md,
			fontWeight: fontWeights.bold,
			lineHeight: lineHeights.tight,
			letterSpacing: letterSpacings.tight
		},
		sm: {
			fontSize: fontSizes.display.sm,
			fontWeight: fontWeights.bold,
			lineHeight: lineHeights.tight,
			letterSpacing: letterSpacings.tight
		}
	},
	// Heading Styles
	heading: {
		xl: {
			fontSize: fontSizes.heading.xl,
			fontWeight: fontWeights.bold,
			lineHeight: lineHeights.tight,
			letterSpacing: letterSpacings.tight
		},
		lg: {
			fontSize: fontSizes.heading.lg,
			fontWeight: fontWeights.bold,
			lineHeight: lineHeights.snug,
			letterSpacing: letterSpacings.tight
		},
		md: {
			fontSize: fontSizes.heading.md,
			fontWeight: fontWeights.semibold,
			lineHeight: lineHeights.snug,
			letterSpacing: letterSpacings.normal
		},
		sm: {
			fontSize: fontSizes.heading.sm,
			fontWeight: fontWeights.semibold,
			lineHeight: lineHeights.snug,
			letterSpacing: letterSpacings.normal
		},
		xs: {
			fontSize: fontSizes.heading.xs,
			fontWeight: fontWeights.semibold,
			lineHeight: lineHeights.normal,
			letterSpacing: letterSpacings.normal
		}
	},
	// Body Styles
	body: {
		lg: {
			fontSize: fontSizes.body.lg,
			fontWeight: fontWeights.regular,
			lineHeight: lineHeights.relaxed
		},
		md: {
			fontSize: fontSizes.body.md,
			fontWeight: fontWeights.regular,
			lineHeight: lineHeights.normal
		},
		sm: {
			fontSize: fontSizes.body.sm,
			fontWeight: fontWeights.regular,
			lineHeight: lineHeights.normal
		},
		xs: {
			fontSize: fontSizes.body.xs,
			fontWeight: fontWeights.regular,
			lineHeight: lineHeights.normal
		}
	},
	// Label Styles
	label: {
		lg: {
			fontSize: fontSizes.label.lg,
			fontWeight: fontWeights.medium,
			lineHeight: lineHeights.normal
		},
		md: {
			fontSize: fontSizes.label.md,
			fontWeight: fontWeights.medium,
			lineHeight: lineHeights.normal
		},
		sm: {
			fontSize: fontSizes.label.sm,
			fontWeight: fontWeights.medium,
			lineHeight: lineHeights.normal,
			letterSpacing: letterSpacings.wide,
			textTransform: "uppercase" as const
		}
	}
} as const;

/**
 * Semantic Typography Tokens
 * 실제 사용 목적에 따른 타이포그래피 매핑
 */
export const semanticTypography = {
	// Page Titles
	pageTitle: typographyStyles.display.md,
	sectionTitle: typographyStyles.heading.xl,

	// Content Headings
	h1: typographyStyles.heading.xl,
	h2: typographyStyles.heading.lg,
	h3: typographyStyles.heading.md,
	h4: typographyStyles.heading.sm,
	h5: typographyStyles.heading.xs,
	h6: typographyStyles.heading.xs,

	// Body Text
	bodyLarge: typographyStyles.body.lg,
	bodyDefault: typographyStyles.body.md,
	bodySmall: typographyStyles.body.sm,
	caption: typographyStyles.body.xs,

	// UI Elements
	button: {
		fontSize: fontSizes.body.sm,
		fontWeight: fontWeights.medium,
		lineHeight: lineHeights.normal
	},
	input: {
		fontSize: fontSizes.body.md,
		fontWeight: fontWeights.regular,
		lineHeight: lineHeights.normal
	},
	badge: typographyStyles.label.md,
	tag: typographyStyles.label.lg,

	// Code
	code: {
		fontFamily: fontFamilies.mono,
		fontSize: fontSizes.body.sm,
		fontWeight: fontWeights.medium
	},
	codeBlock: {
		fontFamily: fontFamilies.mono,
		fontSize: fontSizes.body.sm,
		fontWeight: fontWeights.regular,
		lineHeight: lineHeights.relaxed
	}
} as const;

/**
 * Utility Classes Mapping
 * Tailwind 스타일 유틸리티 클래스명
 */
export const utilityClasses = {
	// Display
	"text-display-lg": "text-display-lg",
	"text-display-md": "text-display-md",
	"text-display-sm": "text-display-sm",

	// Heading
	"text-heading-xl": "text-heading-xl",
	"text-heading-lg": "text-heading-lg",
	"text-heading-md": "text-heading-md",
	"text-heading-sm": "text-heading-sm",
	"text-heading-xs": "text-heading-xs",

	// Body
	"text-body-lg": "text-body-lg",
	"text-body-md": "text-body-md",
	"text-body-sm": "text-body-sm",
	"text-body-xs": "text-body-xs",

	// Label
	"text-label-lg": "text-label-lg",
	"text-label-md": "text-label-md",
	"text-label-sm": "text-label-sm"
} as const;

/**
 * Type Exports
 */
export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacings;
export type TypographyStyle = keyof typeof typographyStyles;
export type SemanticTypographyKey = keyof typeof semanticTypography;
export type UtilityClassName = keyof typeof utilityClasses;
