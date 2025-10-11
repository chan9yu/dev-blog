/**
 * SEO Configuration
 *
 * 사이트 전체의 메타데이터와 SEO 설정을 관리합니다.
 */
export const SITE = {
	// 기본 정보
	name: "blog9yu.dev",
	title: "chan9yu · dev blog",
	titleTemplate: "%s · chan9yu",
	description:
		"프론트엔드 개발자 여찬규의 기술 블로그. React, TypeScript, Next.js를 활용한 웹 개발 경험과 인사이트를 공유합니다.",
	shortDescription: "프론트엔드 개발 경험과 인사이트를 공유하는 기술 블로그",

	// 저자 정보
	author: {
		name: "여찬규",
		nickname: "chan9yu",
		email: "dev.cgyeo@gmail.com",
		url: "https://github.com/chan9yu",
		bio: "사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 웹 프론트엔드 개발자"
	},

	// URL 설정
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.chan9yu.dev",
	repoUrl: "https://github.com/chan9yu/blog9yu.dev",

	// 소셜 미디어
	social: {
		github: "https://github.com/chan9yu",
		twitter: null as string | null, // Twitter/X 계정이 있으면 추가
		linkedin: null as string | null
	},

	// 이미지
	defaultOG: "/og-template.png", // 1200x630
	logo: "/favicons/android-chrome-192x192.png",

	// 언어 & 지역
	locale: "ko_KR",
	language: "ko",

	// 키워드
	keywords: [
		"프론트엔드",
		"Frontend",
		"React",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"웹 개발",
		"Web Development",
		"UI/UX",
		"개발 블로그",
		"기술 블로그",
		"chan9yu",
		"여찬규"
	],

	// 검증 코드 (Google Search Console, Naver 등)
	verification: {
		google: null as string | null, // Google Search Console 인증 코드
		naver: null as string | null, // 네이버 웹마스터 도구 인증 코드
		kakao: null as string | null // 카카오 검색 인증 코드
	}
} as const;
