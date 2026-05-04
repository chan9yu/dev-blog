import "@/shared/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { SearchTrigger } from "@/features/search";
import { ThemeSwitcher } from "@/features/theme";
import { ScrollReset } from "@/shared/components/common/ScrollReset";
import { ScrollToTop } from "@/shared/components/common/ScrollToTop";
import { Footer } from "@/shared/components/layouts/Footer";
import { Header } from "@/shared/components/layouts/Header";
import { MobileMenu } from "@/shared/components/layouts/MobileMenu";
import { getSiteUrl, siteMetadata } from "@/shared/config/site";
import searchIndexJson from "@/shared/data/search-index.json";
import { buildWebSiteJsonLd, JsonLdScript } from "@/shared/seo";
import type { PostSummary } from "@/shared/types";

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

const ROOT_OG_IMAGE = `/og?title=${encodeURIComponent(siteMetadata.name)}`;

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: siteMetadata.title,
		template: `%s | ${siteMetadata.name}`
	},
	description: siteMetadata.description,
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		siteName: siteMetadata.name,
		locale: siteMetadata.locale,
		url: "/",
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: [{ url: ROOT_OG_IMAGE, width: 1200, height: 630, alt: siteMetadata.title }]
	},
	twitter: {
		card: "summary_large_image",
		title: siteMetadata.title,
		description: siteMetadata.description,
		images: [ROOT_OG_IMAGE]
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

const websiteJsonLd = buildWebSiteJsonLd({
	siteUrl: siteMetadata.url,
	siteName: siteMetadata.name,
	description: siteMetadata.description,
	authorName: siteMetadata.author
});

// JSON import의 TypeScript 추론 타입은 series/seriesOrder가 모두 null인 경우 union 정보를 잃을 수 있어
// 모듈 경계에서 단 한 번 PostSummary[]로 narrow. 빌드 스크립트(scripts/build-search-index.mjs)가 schema를
// 1:1 mirror하고 STRICT_FRONTMATTER=1 빌드 path가 동일 contents/를 재검증하므로 cast 안전성 확보.
const searchablePosts = searchIndexJson as PostSummary[];

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
			<body className="bg-background text-foreground flex min-h-screen flex-col font-sans antialiased">
				<JsonLdScript id="website-json-ld" data={websiteJsonLd} />
				<Providers>
					<Suspense fallback={null}>
						<ScrollReset />
					</Suspense>
					<a
						href="#main-content"
						className="focus-visible:ring-ring bg-background text-foreground sr-only z-50 rounded-md px-4 py-2 font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:ring-2 focus-visible:outline-none"
					>
						본문 바로가기
					</a>
					<Suspense
						fallback={
							<div aria-hidden className="border-border-subtle bg-background sticky top-0 z-40 h-16 border-b" />
						}
					>
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
					<ScrollToTop />
				</Providers>
				{/* Vercel 호스트 환경에서만 마운트 — 로컬 `pnpm start`에서는 `_vercel/insights/script.js` 404 회귀 차단. */}
				{process.env.VERCEL ? (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				) : null}
			</body>
		</html>
	);
}
