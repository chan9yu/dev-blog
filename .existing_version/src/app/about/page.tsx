import type { Metadata } from "next";
import Image from "next/image";

import { CustomMDX, SocialLinks } from "@/shared/components";
import { SITE } from "@/shared/config";
import { getAboutContent } from "@/shared/services";

export const metadata: Metadata = {
	title: "About",
	description:
		"3년 경력 프론트엔드 개발자 여찬규입니다. React, TypeScript, Next.js, WebRTC를 활용한 실시간 통신 서비스 개발 경험이 있습니다. 복잡한 문제를 단순하고 명확한 코드로 풀어내는 것을 좋아합니다.",
	openGraph: {
		title: "About · chan9yu",
		description: "프론트엔드 개발자 여찬규의 소개. 실시간 통신 서비스 개발 경험, 기술 스택, 개발 철학을 확인하세요.",
		type: "profile",
		url: `${SITE.url}/about`,
		images: [
			{
				url: SITE.defaultOG,
				width: 1200,
				height: 630,
				alt: "About chan9yu - Frontend Developer"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "About · chan9yu",
		description: "프론트엔드 개발자 여찬규의 소개 - React, TypeScript, WebRTC"
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
				<h1 className="text-primary mb-6 text-4xl font-bold tracking-tight sm:text-5xl">About</h1>
				<hr className="border-primary" />
			</header>

			{/* Profile Section */}
			<div className="not-prose mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="relative h-32 w-32 shrink-0 rounded-full">
					<Image
						src="/images/profile-image.jpg"
						alt="Profile"
						fill
						sizes="128px"
						className="rounded-xl object-cover"
						priority
					/>
				</div>
				<div className="flex-1 text-center sm:text-left">
					<h2 className="text-primary mb-2 text-2xl font-bold">여찬규 (Chan9yu)</h2>
					<p className="text-secondary mb-4 text-lg">Frontend Engineer</p>
					<SocialLinks />
				</div>
			</div>

			<article className="prose prose-lg">
				<CustomMDX source={content} />
			</article>
		</div>
	);
}
