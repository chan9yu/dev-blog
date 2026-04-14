import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard } from "@/features/posts";
import { Container } from "@/shared/components/Container";
import { postsFixture } from "@/shared/fixtures/posts";
import { tagsFixture } from "@/shared/fixtures/tags";
import { resolveThumbnailSrc } from "@/shared/utils/resolveThumbnail";
import { normalizeSlug, TAG_MAX_LENGTH } from "@/shared/utils/slug";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
	const { tag } = await params;
	const normalized = normalizeSlug(tag, TAG_MAX_LENGTH);
	if (!normalized) return { title: "Tag" };
	return {
		title: `${normalized} 태그`,
		description: `${normalized} 태그가 달린 포스트 목록.`,
		alternates: { canonical: `/tags/${normalized}` }
	};
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
	const { tag } = await params;
	const normalized = normalizeSlug(tag, TAG_MAX_LENGTH);
	if (!normalized) notFound();

	const tagMeta = tagsFixture.find((item) => item.slug === normalized);
	const filtered = postsFixture
		.filter((post) => !post.private && post.tags.includes(normalized))
		.map((post) => ({ ...post, thumbnail: resolveThumbnailSrc(post.thumbnail) }));

	if (!tagMeta && filtered.length === 0) notFound();

	return (
		<Container>
			<div className="space-y-10 py-10 lg:py-14">
				<header className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
						<span aria-hidden>#</span>
						<span className="sr-only">태그: </span>
						{normalized}
					</h1>
					<p className="text-muted-foreground text-sm">총 {filtered.length}개의 글</p>
				</header>

				{filtered.length === 0 ? (
					<p className="text-muted-foreground py-12 text-center text-sm">이 태그의 포스트가 없습니다.</p>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
						{filtered.map((post, index) => (
							<PostCard key={post.slug} post={post} variant="grid" priority={index < 2} />
						))}
					</div>
				)}
			</div>
		</Container>
	);
}
