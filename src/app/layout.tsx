import "@/shared/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import Script from "next/script";
import type { ReactNode } from "react";

import { MotionProvider, ScrollReset, ScrollToTop, SiteFooter, SiteNavbar } from "@/shared/components";
import { SITE } from "@/shared/config";
import { type Theme, themeInitScript } from "@/shared/utils";

const baseUrl = new URL(SITE.url);

export const metadata: Metadata = {
	metadataBase: baseUrl,
	applicationName: SITE.name,
	title: {
		default: SITE.title,
		template: SITE.titleTemplate
	},
	description: SITE.description,
	keywords: [...SITE.keywords],
	authors: [
		{
			name: SITE.author.name,
			url: SITE.author.url
		}
	],
	creator: SITE.author.nickname,
	publisher: SITE.author.nickname,
	formatDetection: {
		telephone: false,
		email: false,
		address: false
	},
	alternates: {
		canonical: SITE.url,
		languages: {
			"ko-KR": SITE.url
		},
		types: {
			"application/rss+xml": `${SITE.url}/rss`
		}
	},
	openGraph: {
		title: SITE.title,
		description: SITE.description,
		url: SITE.url,
		siteName: SITE.name,
		locale: SITE.locale,
		type: "website",
		images: [
			{
				url: SITE.defaultOG,
				width: 1200,
				height: 630,
				alt: `${SITE.title} - ${SITE.shortDescription}`,
				type: "image/png"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: SITE.title,
		description: SITE.description,
		images: [SITE.defaultOG],
		creator: SITE.social.twitter ?? undefined
	},
	robots: {
		index: process.env.VERCEL_ENV === "production",
		follow: true,
		googleBot: {
			index: process.env.VERCEL_ENV === "production",
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1
		}
	},
	verification: {
		google: SITE.verification.google ?? undefined,
		...(SITE.verification.naver && {
			other: {
				"naver-site-verification": SITE.verification.naver
			}
		})
	},
	icons: {
		icon: [
			{ url: "/favicons/favicon.ico", sizes: "any" },
			{ url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
		],
		apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
		other: [{ rel: "mask-icon", url: "/favicons/favicon.ico" }]
	},
	category: "technology",
	classification: "Technology Blog"
};

type RootLayoutProps = {
	readonly children: ReactNode;
};

const pretendard = localFont({
	src: "../../public/fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "45 920",
	variable: "--font-pretendard",
	preload: true,
	fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
	adjustFontFallback: "Arial"
});

export default async function RootLayout({ children }: RootLayoutProps) {
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	const htmlClassName = `${theme === "dark" ? "dark" : ""} ${pretendard.variable}`.trim();

	return (
		<html lang="ko" className={htmlClassName}>
			<body className="font-sans antialiased">
				{/* Theme initialization script - must run before React hydration */}
				<Script
					id="theme-init"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: themeInitScript
					}}
				/>
				{/* JSON-LD Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: SITE.title,
							description: SITE.description,
							url: SITE.url,
							author: {
								"@type": "Person",
								name: SITE.author.name,
								url: SITE.author.url,
								email: SITE.author.email,
								jobTitle: "Frontend Developer",
								description: SITE.author.bio,
								knowsAbout: [
									"React",
									"TypeScript",
									"Next.js",
									"WebRTC",
									"WebSocket",
									"Real-time Communication",
									"Web Development",
									"Frontend Development"
								],
								sameAs: [SITE.social.github, SITE.social.linkedin].filter(Boolean)
							},
							publisher: {
								"@type": "Person",
								name: SITE.author.name,
								url: SITE.author.url
							},
							inLanguage: "ko-KR",
							potentialAction: {
								"@type": "SearchAction",
								target: `${SITE.url}/search?q={search_term_string}`,
								"query-input": "required name=search_term_string"
							}
						})
					}}
				/>
				<MotionProvider>
					<ScrollReset />
					<SiteNavbar />
					<div className="mx-auto max-w-6xl px-6 pb-12 sm:px-8 lg:px-12">
						<main className="mt-20">{children}</main>
						<SiteFooter />
					</div>
					<ScrollToTop />
				</MotionProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
