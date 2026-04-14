import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
	PostMetaHeader,
	PostNavigation,
	ReadingProgress,
	RelatedPosts,
	ScrollToTop,
	ShareButtons,
	Toc
} from "@/features/posts";
import { SeriesNavigation } from "@/features/series";
import { Container } from "@/shared/components/Container";
import { getSiteUrl } from "@/shared/config/site";
import { postDetailsFixture } from "@/shared/fixtures/post-details";
import { postsFixture } from "@/shared/fixtures/posts";
import { seriesFixture } from "@/shared/fixtures/series";
import type { AdjacentPosts, RelatedPost } from "@/shared/types";
import { normalizeSlug } from "@/shared/utils/slug";

type PostDetailPageProps = {
	params: Promise<{ slug: string }>;
};

function findAdjacent(currentSlug: string): AdjacentPosts {
	const publicPosts = postsFixture.filter((post) => !post.private);
	const index = publicPosts.findIndex((post) => post.slug === currentSlug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index < publicPosts.length - 1 ? (publicPosts[index + 1] ?? null) : null,
		next: index > 0 ? (publicPosts[index - 1] ?? null) : null
	};
}

function findRelated(currentSlug: string, tags: string[]): RelatedPost[] {
	return postsFixture
		.filter((post) => !post.private && post.slug !== currentSlug)
		.map((post) => {
			const overlap = post.tags.filter((tag) => tags.includes(tag)).length;
			return { ...post, overlapScore: overlap };
		})
		.filter((post) => post.overlapScore > 0)
		.sort((a, b) => b.overlapScore - a.overlapScore)
		.slice(0, 3);
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) return { title: "Post" };
	const post = postsFixture.find((item) => item.slug === normalized);
	if (!post || post.private) return { title: "Post" };
	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: `/posts/${post.slug}` }
	};
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	const summary = postsFixture.find((item) => item.slug === normalized);
	if (!summary || summary.private) notFound();

	const detail = postDetailsFixture.find((item) => item.slug === normalized);
	const adjacent = findAdjacent(summary.slug);
	const related = findRelated(summary.slug, summary.tags);
	const currentSeries = summary.series ? seriesFixture.find((item) => item.slug === summary.series) : null;
	const shareUrl = `${getSiteUrl()}/posts/${summary.slug}`;

	return (
		<>
			<ReadingProgress />
			<Container>
				<div className="flex flex-col gap-10 py-10 lg:flex-row lg:gap-12 lg:py-14">
					<article className="min-w-0 flex-1 space-y-10">
						<PostMetaHeader post={summary} />

						{currentSeries && <SeriesNavigation series={currentSeries} currentSlug={summary.slug} />}

						<section aria-label="본문" className="prose prose-neutral dark:prose-invert max-w-none">
							{detail ? (
								<pre className="text-muted-foreground bg-muted rounded-md p-4 text-xs leading-relaxed whitespace-pre-wrap">
									{detail.contentMdx}
								</pre>
							) : (
								<p className="text-muted-foreground text-sm">
									본문은 M2 MDX 파이프라인 통합 이후 렌더됩니다. 현재는 fixture 미등록 포스트입니다.
								</p>
							)}
						</section>

						<div className="border-border-subtle flex flex-wrap items-center justify-between gap-4 border-t pt-6">
							<span className="text-muted-foreground text-sm">이 글이 도움이 되었다면 공유해 주세요.</span>
							<ShareButtons title={summary.title} url={shareUrl} />
						</div>

						<PostNavigation adjacent={adjacent} />

						<RelatedPosts posts={related} />
					</article>

					<aside className="w-full lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:self-start">
						<Toc items={detail?.toc ?? []} />
					</aside>
				</div>
			</Container>
			<ScrollToTop />
		</>
	);
}
