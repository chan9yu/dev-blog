import { notFound } from "next/navigation";

import { normalizeSlug } from "@/shared/utils/slug";

type SeriesDetailPageProps = {
	params: Promise<{ slug: string }>;
};

// M4 시리즈 집계 통합 시 `generateStaticParams`로 실제 시리즈 slug 반환 예정.
// Next.js 16 `cacheComponents` 제약으로 그때까지는 생략 → PPR 모드.

export async function generateMetadata({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) return { title: "Series" };
	return {
		title: `${normalized} 시리즈`,
		description: `${normalized} 시리즈의 연속된 포스트 목록. M4에서 실제 집계 반영 예정.`,
		alternates: { canonical: `/series/${normalized}` }
	};
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	return (
		<section className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">{normalized}</h1>
			<p className="text-muted-foreground mt-4">M1에서 시리즈 상세 UI 구현 예정 (헤더 + 순서 네비 + 목록).</p>
		</section>
	);
}
