import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"프론트엔드 개발자 여찬규(chan9yu)의 자기소개. 3년차 실무 경험과 React·TypeScript·Next.js·WebRTC 기반 실시간 통신 프로젝트, 학습 태도와 관심 분야를 정리했습니다.",
	alternates: { canonical: "/about" }
};

export default function AboutPage() {
	return (
		<section className="mx-auto max-w-prose px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">About</h1>
			<p className="text-muted-foreground mt-4">
				M4에서 <code>contents/about/index.md</code> 렌더 + 프로필·소셜 링크 통합 예정.
			</p>
		</section>
	);
}
