/**
 * 사이트 전역 설정 placeholder.
 *
 * 본 작업은 M0-33에서 완성 예정 — title/description/url/author/social/OG 기본값 등 추가.
 * 현 단계는 **임시 데이터 단일 source 역할**:
 *   - Header/MobileMenu가 동일한 navigation 목록을 두 파일에 hardcoded하지 않도록 차단
 *   - site.ts 도입 시 호출자는 import 경로만 갱신
 *
 * project memory: `project_temp_data_single_source.md`
 */

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
	title: "chan9yu | 기술 개발 블로그",
	description:
		"프론트엔드 개발자 여찬규의 기술 블로그. React, TypeScript, Next.js, WebRTC를 활용한 웹 개발 및 실시간 통신 경험을 공유합니다.",
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

/**
 * Footer·About 페이지에서 참조. 실제 아이콘 렌더는 호출자에서 lucide-react import.
 * `iconName`은 `.claude/rules/icons.md`의 lucide-react 식별자와 일치.
 */
export const siteSocials: SocialLinkConfig[] = [
	{ label: "GitHub", href: "https://github.com/chan9yu", iconName: "Github" },
	{ label: "LinkedIn", href: "https://linkedin.com/in/chan9yu", iconName: "Linkedin" },
	{ label: "Email", href: "mailto:dev.cgyeo@gmail.com", iconName: "Mail" }
];

/**
 * 환경별 사이트 URL — metadataBase 등에 사용.
 * - production: siteMetadata.url (프로덕션 도메인)
 * - preview (VERCEL_URL 주입): Vercel preview URL
 * - local: http://localhost:3100
 *
 * 이 분기를 통해 preview 환경의 OG 이미지·canonical이 잘못된 prod 도메인을 가리키는 것을 방지.
 */
export function getSiteUrl() {
	if (process.env.VERCEL_ENV === "production") {
		return siteMetadata.url;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3100";
}
