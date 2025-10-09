export const SITE = {
	name: "blog9yu.dev",
	title: "chan9yu · dev blog",
	description:
		"프론트엔드 개발의 아이디어와 경험을 기록하는 개발 블로그. 코드와 디자인, 사용자 경험을 아우르는 인사이트를 담습니다.",
	authorName: "chan9yu",
	authorEmail: "dev.cgyeo@gmail.com",
	repoUrl: "https://github.com/chan9yu/blog9yu.dev",
	locale: "ko_KR",
	// 배포 시 NEXT_PUBLIC_SITE_URL= https://도메인 으로 세팅 권장
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog9yu.dev",
	twitter: null as string | null, // 추후 @handle 있으면 채우기
	defaultOG: "/og-template.png" // public/og-template.png
} as const;
