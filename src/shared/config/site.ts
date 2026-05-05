import packageJson from "../../../package.json" with { type: "json" };

export const APP_VERSION = packageJson.version;

export type NavItem = {
	href: string;
	label: string;
};

export const siteNav: NavItem[] = [
	{ href: "/", label: "홈" },
	{ href: "/posts", label: "포스트" },
	{ href: "/series", label: "시리즈" },
	{ href: "/tags", label: "태그" },
	{ href: "/about", label: "About" }
];

export const siteMetadata = {
	name: "chan9yu",
	title: "chan9yu | 프론트엔드 개발 블로그",
	description:
		"프론트엔드 개발자 여찬규의 기술 블로그. React 19, TypeScript, Next.js App Router, WebRTC 기반 실시간 통신 등 실무에서 마주친 문제와 학습 기록을 정리합니다. 신뢰할 수 있는 자료를 토대로 깊이 있게 다룹니다.",
	url: "https://chan9yu.dev",
	author: "chan9yu",
	locale: "ko_KR",
	avatar: "https://avatars.githubusercontent.com/u/80776262?v=4",
	themeColor: "#4f46e5"
} as const;

type SocialLinkConfig = {
	label: string;
	href: string;
	iconName: "Github" | "Linkedin" | "Mail" | "Rss";
};

export const siteSocials: SocialLinkConfig[] = [
	{ label: "GitHub", href: "https://github.com/chan9yu", iconName: "Github" },
	{ label: "LinkedIn", href: "https://linkedin.com/in/chan9yu", iconName: "Linkedin" },
	{ label: "Email", href: "mailto:dev.cgyeo@gmail.com", iconName: "Mail" }
];

// 환경별 사이트 URL 결정 (canonical·OG·sitemap·rss SSOT).
// 우선순위: NEXT_PUBLIC_SITE_URL > Vercel production > Vercel preview > 로컬 dev fallback.
// NEXT_PUBLIC_SITE_URL을 최상위에 둔 이유 — Cloudflare Pages·Netlify·self-host 등
// Vercel 외 배포에서도 명시적 도메인 주입만으로 canonical/sitemap이 정확히 동작.
export function getSiteUrl() {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
	if (explicit) {
		try {
			const parsed = new URL(explicit);
			// production에서는 https 강제 — canonical/OG가 http로 깨지면 SEO 시그널 손상.
			if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
				throw new Error(`NEXT_PUBLIC_SITE_URL must use https:// in production (got "${parsed.protocol}//")`);
			}
			return explicit.replace(/\/+$/, "");
		} catch (error) {
			if (process.env.NODE_ENV === "production") throw error;
			// dev/preview: invalid URL은 무시하고 다음 분기로 fallback (개발자 실수에 빠른 피드백 + 빌드 차단은 회피).
		}
	}

	if (process.env.VERCEL_ENV === "production") {
		return siteMetadata.url;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3100";
}
