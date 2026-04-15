import { Tag } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublicPosts, PostList, PostListSkeleton } from "@/features/posts";
import { Container } from "@/shared/components/layouts/Container";
import { tagsFixture } from "@/shared/fixtures/tags";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";
import { normalizeSlug, TAG_MAX_LENGTH } from "@/shared/utils/slug";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
	return tagsFixture.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
	const { tag } = await params;

	const normalized = normalizeSlug(decodeURIComponent(tag), TAG_MAX_LENGTH);
	if (!normalized) return { title: "Tag" };

	return {
		title: `#${normalized}`,
		description: `${normalized} 태그가 포함된 포스트를 확인하세요. 관련 주제의 글을 한눈에 탐색할 수 있습니다.`,
		alternates: { canonical: `/tags/${normalized}` }
	};
}

/**
 * 레거시 /tags/[tag] 디자인:
 * - header mb-12: TagIcon accent size-8 + #태그명 h1 + "총 N개의 글" + hr
 * - FilteredBlogPosts defaultView="grid" 대신 우리 PostList(뷰 토글) 재사용
 */
export default async function TagDetailPage({ params }: TagDetailPageProps) {
	const { tag } = await params;

	const normalized = normalizeSlug(decodeURIComponent(tag), TAG_MAX_LENGTH);
	if (!normalized) notFound();

	const filtered = resolvePostThumbnails(getPublicPosts().filter((post) => post.tags.includes(normalized)));

	const tagMeta = tagsFixture.find((item) => item.slug === normalized);
	if (!tagMeta && filtered.length === 0) notFound();

	return (
		<Container>
			<div className="py-8 lg:py-10">
				<header className="mb-12 space-y-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Tag className="text-accent size-8" aria-hidden />
							<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-4xl md:text-5xl">
								#{normalized}
							</h1>
						</div>
						<p className="text-muted-foreground text-base sm:text-lg">총 {filtered.length}개의 글</p>
					</div>
					<hr className="border-border" />
				</header>

				<Suspense fallback={<PostListSkeleton count={3} />}>
					<PostList posts={filtered} />
				</Suspense>
			</div>
		</Container>
	);
}
