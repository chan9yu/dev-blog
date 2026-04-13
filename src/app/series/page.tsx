import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Series",
	description:
		"chan9yu 개발 블로그의 시리즈 포스트 허브. 한 주제를 여러 편에 걸쳐 깊이 다루는 연속물을 순서대로 학습할 수 있도록 연결된 글 단위로 구성했습니다.",
	alternates: { canonical: "/series" }
};

export default function SeriesHubPage() {
	return (
		<section className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">Series</h1>
			<p className="text-muted-foreground mt-4">M1에서 시리즈 허브 UI 구현 예정 (카드 + 미리보기).</p>
		</section>
	);
}
