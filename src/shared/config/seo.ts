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
		"프론트엔드 개발자 여찬규의 기술 블로그. React, TypeScript, Next.js, WebRTC를 활용한 웹 개발 및 실시간 통신 경험을 공유합니다. 3년간의 실무 경험을 바탕으로 문제 해결 과정과 인사이트를 기록합니다.",
	shortDescription: "프론트엔드 개발자의 실무 경험과 기술 인사이트",

	// 저자 정보
	author: {
		name: "여찬규",
		nickname: "chan9yu",
		email: "dev.cgyeo@gmail.com",
		url: "https://github.com/chan9yu",
		bio: "복잡한 문제를 단순하고 명확한 코드로 풀어내는 것을 좋아하는 프론트엔드 개발자. React, TypeScript, WebRTC를 활용한 실시간 통신 서비스 개발 경험 보유."
	},

	// URL 설정
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.chan9yu.dev",
	repoUrl: "https://github.com/chan9yu/blog9yu.dev",

	// 소셜 미디어
	social: {
		github: "https://github.com/chan9yu",
		twitter: null as string | null,
		linkedin: "https://www.linkedin.com/in/chan9yu/"
	},

	// 이미지
	defaultOG: "/images/default-og-image.png", // 1200x630
	logo: "/favicons/android-chrome-192x192.png",

	// 언어 & 지역
	locale: "ko_KR",
	language: "ko",

	// 키워드
	keywords: [
		// 직무 & 기술
		"프론트엔드",
		"Frontend",
		"Frontend Developer",
		"웹 개발",
		"Web Development",
		// 프레임워크 & 라이브러리
		"React",
		"Next.js",
		"TypeScript",
		"JavaScript",
		"Tailwind CSS",
		// 실시간 통신
		"WebRTC",
		"WebSocket",
		"실시간 통신",
		"화상 통화",
		"Video Chat",
		"Real-time Communication",
		// UI/UX
		"UI/UX",
		"사용자 경험",
		"인터페이스 디자인",
		// 블로그 관련
		"개발 블로그",
		"기술 블로그",
		"Tech Blog",
		"개발자 블로그",
		// 개인 브랜드
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
