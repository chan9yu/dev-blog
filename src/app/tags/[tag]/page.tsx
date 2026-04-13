import { notFound } from "next/navigation";

import { normalizeSlug, TAG_MAX_LENGTH } from "@/shared/utils/slug";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

// M4 태그 집계 통합 시 `generateStaticParams`로 실제 태그 목록 반환 예정.
// Next.js 16 `cacheComponents` 제약으로 그때까지는 생략 → PPR 모드.

export async function generateMetadata({ params }: TagDetailPageProps) {
	const { tag } = await params;
	const normalized = normalizeSlug(tag, TAG_MAX_LENGTH);
	if (!normalized) return { title: "Tag" };
	return {
		title: `${normalized} 태그`,
		description: `${normalized} 태그가 달린 포스트 목록. M4에서 실제 태그 집계 반영 예정.`,
		alternates: { canonical: `/tags/${normalized}` }
	};
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
	const { tag } = await params;
	const normalized = normalizeSlug(tag, TAG_MAX_LENGTH);
	if (!normalized) notFound();

	return (
		<section className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">
				<span aria-hidden="true">#</span>
				<span className="sr-only">태그: </span>
				{normalized}
			</h1>
			<p className="text-muted-foreground mt-4">M1에서 태그별 포스트 목록 UI 구현 예정.</p>
		</section>
	);
}
