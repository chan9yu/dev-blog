import "@/shared/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { SearchTrigger } from "@/features/search";
import { ThemeSwitcher } from "@/features/theme";
import { Footer } from "@/shared/components/Footer";
import { Header } from "@/shared/components/Header";
import { MobileMenu } from "@/shared/components/MobileMenu";
import { ScrollReset } from "@/shared/components/ScrollReset";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import { postsFixture } from "@/shared/fixtures/posts";

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
	const searchablePosts = postsFixture.filter((post) => !post.private);

	return (
		<html lang="ko" className={pretendard.variable} suppressHydrationWarning>
			<body className="bg-background text-foreground flex min-h-screen flex-col font-sans antialiased">
				<Providers>
					<Suspense fallback={null}>
						<ScrollReset />
					</Suspense>
					<Suspense fallback={<div className="border-border-subtle bg-background sticky top-0 z-40 h-16 border-b" />}>
						<Header
							searchSlot={<SearchTrigger posts={searchablePosts} />}
							themeSlot={<ThemeSwitcher />}
							mobileMenuSlot={<MobileMenu />}
						/>
					</Suspense>
					<main id="main-content" tabIndex={-1} className="flex-1">
						{children}
					</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
