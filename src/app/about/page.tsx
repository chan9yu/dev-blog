import type { Metadata } from "next";
import Image from "next/image";

import { CustomMDX, SocialLinks } from "@/shared/components";
import { SITE } from "@/shared/config";
import { getAboutContent } from "@/shared/services";

export const metadata: Metadata = {
	title: "About",
	description:
		"사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 웹 프론트엔드 개발자 여찬규입니다. React, TypeScript, Next.js를 활용한 개발 경험과 철학을 소개합니다.",
	openGraph: {
		title: "About · chan9yu",
		description: "프론트엔드 개발자 여찬규의 소개 페이지. 기술 스택, 관심사, 개발 철학을 확인하세요.",
		type: "profile",
		url: `${SITE.url}/about`,
		images: [
			{
				url: SITE.defaultOG,
				width: 1200,
				height: 630,
				alt: "About chan9yu"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "About · chan9yu",
		description: "프론트엔드 개발자 여찬규의 소개 페이지"
	},
	alternates: {
		canonical: `${SITE.url}/about`
	}
};

export default async function AboutPage() {
	const content = await getAboutContent();

	return (
		<div className="mx-auto">
			{/* Header */}
			<header className="not-prose mb-12">
				<h1 className="title text-primary mb-6 text-4xl font-bold tracking-tight sm:text-5xl">About</h1>
				<hr className="border-primary" />
			</header>

			{/* Profile Section */}
			<div className="not-prose mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="relative h-32 w-32 flex-shrink-0 rounded-full">
					<Image
						src="https://avatars.githubusercontent.com/u/80776262?v=4"
						alt="Profile"
						fill
						sizes="128px"
						className="rounded-xl object-cover"
						priority
					/>
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h2 className="text-primary mb-2 text-2xl font-bold">찬규 (Chan9yu)</h2>
					<p className="text-secondary mb-4 text-lg">프론트엔드 개발자</p>
					<SocialLinks />
				</div>
			</div>

			<article className="prose prose-lg">
				<CustomMDX source={content} />
			</article>
		</div>
	);
}
