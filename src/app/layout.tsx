import "@/shared/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";

import { ScrollReset, ScrollToTop, SiteFooter, SiteNavbar } from "@/shared/components";
import { SITE } from "@/shared/config";
import { type Theme, themeInitScript } from "@/shared/utils";

const baseUrl = new URL(SITE.url);

export const metadata: Metadata = {
	metadataBase: baseUrl,
	applicationName: SITE.name,
	title: {
		default: SITE.title,
		template: `%s · ${SITE.authorName}`
	},
	description: SITE.description,
	keywords: ["프론트엔드", "Frontend", "React", "Next.js", "TypeScript", "UI/UX", "개발 블로그", "chan9yu"],
	authors: [{ name: SITE.authorName, url: SITE.url }],
	creator: SITE.authorName,
	publisher: SITE.authorName,
	alternates: {
		canonical: SITE.url,
		languages: {
			"ko-KR": SITE.url
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
				alt: SITE.title
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: SITE.title,
		description: SITE.description,
		images: [SITE.defaultOG]
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
	icons: {
		icon: [
			{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-96.png", sizes: "96x96", type: "image/png" }
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#22C55E" }]
	},
	category: "technology"
};

type RootLayoutProps = {
	readonly children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	const htmlClassName = `${theme === "dark" ? "dark" : ""} ${GeistSans.variable} ${GeistMono.variable}`.trim();

	return (
		<html lang="ko" className={htmlClassName}>
			<body className="antialiased">
				<Script
					id="theme-init"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: themeInitScript
					}}
				/>
				<ScrollReset />
				<SiteNavbar />
				<div className="mx-auto max-w-6xl px-6 pb-12 sm:px-8 lg:px-12">
					<main className="mt-16">{children}</main>
					<SiteFooter />
				</div>
				<ScrollToTop />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
