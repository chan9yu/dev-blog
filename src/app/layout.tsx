import "@/shared/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";

import { ScrollReset, ScrollToTop, SiteFooter, SiteNavbar } from "@/shared/components";
import { baseUrl } from "@/shared/constants";
import { type Theme, themeInitScript } from "@/shared/utils";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Next.js Portfolio Starter",
		template: "%s | Next.js Portfolio Starter"
	},
	description: "This is my portfolio.",
	openGraph: {
		title: "My Portfolio",
		description: "This is my portfolio.",
		url: baseUrl,
		siteName: "My Portfolio",
		locale: "en_US",
		type: "website"
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1
		}
	}
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
				<div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12">
					<SiteNavbar />
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
