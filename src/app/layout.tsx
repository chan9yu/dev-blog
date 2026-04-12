import "@/shared/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";

const pretendard = localFont({
	src: "../../public/fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "45 920",
	variable: "--font-pretendard",
	preload: true,
	fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
	adjustFontFallback: "Arial"
});

export const metadata: Metadata = {
	title: "chan9yu | 기술 개발 블로그",
	description:
		"프론트엔드 개발자 여찬규의 기술 블로그. React, TypeScript, Next.js, WebRTC를 활용한 웹 개발 및 실시간 통신 경험을 공유합니다. 3년간의 실무 경험을 바탕으로 문제 해결 과정과 인사이트를 기록합니다.",
	icons: {
		icon: [
			{ url: "/favicons/favicon.ico", sizes: "any" },
			{ url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
		],
		apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
		other: [{ rel: "mask-icon", url: "/favicons/favicon.ico" }]
	}
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className={`${pretendard.variable}`}>
			<body className="font-sans antialiased">{children}</body>
		</html>
	);
}
