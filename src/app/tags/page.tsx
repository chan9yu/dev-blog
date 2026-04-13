import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tags",
	description:
		"chan9yu 개발 블로그의 태그 허브. 관심 주제별로 포스트를 탐색할 수 있도록 React, TypeScript, Next.js 등 모든 태그를 발행 빈도와 함께 한곳에 모았습니다.",
	alternates: { canonical: "/tags" }
};

export default function TagsHubPage() {
	return (
		<section className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">Tags</h1>
			<p className="text-muted-foreground mt-4">M1에서 태그 허브 UI 구현 예정 (카드 그리드 · 각 태그별 포스트 수).</p>
		</section>
	);
}
