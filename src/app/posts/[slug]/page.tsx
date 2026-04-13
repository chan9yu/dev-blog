import { notFound } from "next/navigation";

import { normalizeSlug } from "@/shared/utils/slug";

type PostDetailPageProps = {
	params: Promise<{ slug: string }>;
};

// M2 MDX 파이프라인 통합 시 `generateStaticParams`로 실제 slug 반환 예정.
// Next.js 16 `cacheComponents` 제약(빈 배열 반환 금지)에 따라 그때까지는 생략 →
// PPR(Partial Prerender) 모드로 동작: 정적 쉘 + 런타임 slug stream.

export async function generateMetadata({ params }: PostDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) return { title: "Post" };
	return {
		title: normalized,
		description: `${normalized} — M2 MDX 파이프라인 통합 후 실제 frontmatter.description으로 교체 예정.`,
		alternates: { canonical: `/posts/${normalized}` }
	};
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	return (
		<article className="mx-auto max-w-prose px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">{normalized}</h1>
			<p className="text-muted-foreground mt-4">M2에서 MDX 파이프라인 통합 후 실제 포스트 렌더.</p>
		</article>
	);
}
