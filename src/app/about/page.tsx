import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SocialLinks } from "@/shared/components";
import { SITE } from "@/shared/config";

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

export default function AboutPage() {
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
				{/* Content */}
				<div className="text-secondary space-y-8">
					<section>
						<h2 className="text-primary mb-4 text-2xl font-bold">👋 안녕하세요</h2>
						<div className="space-y-4 leading-relaxed">
							<p>
								사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 웹 프론트엔드 개발자입니다.
								<br />
								디자인과 개발 사이에서 최적의 균형을 찾는 데 열정을 가지고 있습니다.
							</p>
							<p>
								복잡한 문제를 단순하고 명확한 코드로 풀어내는 것을 좋아하며, 효율적인 협업과 원활한 소통을 통해 더 나은
								제품을 만들기 위해 노력합니다.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-primary mb-4 text-2xl font-bold">💻 기술 스택 & 관심사</h2>
						<div className="space-y-4 leading-relaxed">
							<div>
								<h3 className="text-primary mb-2 font-semibold">주로 사용하는 기술</h3>
								<ul className="list-disc space-y-1 pl-6">
									<li>React, Next.js를 활용한 모던 웹 애플리케이션 개발</li>
									<li>TypeScript 기반의 타입 안전성 있는 코드 작성</li>
									<li>Tailwind CSS를 활용한 효율적인 스타일링</li>
								</ul>
							</div>
							<div>
								<h3 className="text-primary mb-2 font-semibold">관심 분야</h3>
								<ul className="list-disc space-y-1 pl-6">
									<li>사용자 경험(UX)을 개선하는 인터페이스 설계</li>
									<li>웹 성능 최적화 및 접근성 향상</li>
									<li>효율적인 상태 관리 패턴</li>
									<li>개발 생산성을 높이는 도구와 방법론</li>
									<li>컴포넌트 기반 설계와 재사용성</li>
								</ul>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-primary mb-4 text-2xl font-bold">📝 블로그에 대하여</h2>
						<div className="space-y-4 leading-relaxed">
							<p>
								이 블로그는 개발하면서 배운 것들, 경험한 것들, 그리고 생각한 것들을 기록하는 공간입니다.
								<br />
								실무에서 마주한 문제 해결 과정, 새로운 기술 학습 경험, 그리고 개발 관련 인사이트를 공유합니다.
							</p>
							<p>
								Next.js 15와 MDX를 기반으로 만들어졌으며, GitHub을 통해 관리하고 Vercel을 통해 배포됩니다.
								<br />
								소스 코드는{" "}
								<Link
									href="https://github.com/chan9yu/blog9yu.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent font-medium underline"
								>
									GitHub
								</Link>
								에서 확인하실 수 있습니다.
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-primary mb-4 text-2xl font-bold">📬 연락하기</h2>
						<p className="leading-relaxed">
							블로그 내용에 대한 의견이나 피드백, 협업 제안 등 궁금하신 내용이 있으시면 편하게 연락주세요 🙂
							<br />
							<br />
							이메일:{" "}
							<a href="mailto:dev.cgyeo@gmail.com" className="text-accent font-medium underline">
								dev.cgyeo@gmail.com
							</a>
						</p>
					</section>
				</div>
			</article>
		</div>
	);
}
