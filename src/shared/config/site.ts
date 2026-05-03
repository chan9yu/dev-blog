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
	ogImage: "/default-og-image.png",
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

// preview 환경의 OG·canonical이 prod 도메인을 가리키지 않도록 분기 — VERCEL_URL은 Vercel이 주입.
export function getSiteUrl() {
	if (process.env.VERCEL_ENV === "production") {
		return siteMetadata.url;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3100";
}
