import "@/shared/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";

import { getSiteUrl, siteMetadata } from "@/shared/config/site";

import { Providers } from "./providers";

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
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: siteMetadata.title,
		template: `%s | ${siteMetadata.name}`
	},
	description: siteMetadata.description,
	openGraph: {
		type: "website",
		siteName: siteMetadata.name,
		locale: siteMetadata.locale,
		url: siteMetadata.url,
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: [{ url: "/og?title=chan9yu", width: 1200, height: 630, alt: siteMetadata.title }]
	},
	twitter: {
		card: "summary_large_image",
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: ["/og?title=chan9yu"]
	},
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
		<html lang="ko" className={pretendard.variable} suppressHydrationWarning>
			<body className="bg-background text-foreground font-sans antialiased">
				<Providers>
					{/*
					  Skip link — WCAG 2.4.1 Bypass Blocks.
					  M1 Header 통합 시 Header 컴포넌트로 이동 예정 (중복 방지 위해 본 블록 제거).
					*/}
					<a
						href="#main-content"
						className="bg-foreground text-background focus-visible:ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						본문으로 건너뛰기
					</a>
					<main id="main-content" tabIndex={-1}>
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
