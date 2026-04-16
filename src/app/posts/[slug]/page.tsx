import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CommentsSection } from "@/features/comments";
import {
	getAdjacentPosts,
	getPostBySlug,
	getPublicPosts,
	getRelatedPosts,
	PostMetaHeader,
	PostNavigation,
	ReadingProgress,
	RelatedPosts,
	ScrollToTop,
	ShareButtons,
	Toc
} from "@/features/posts";
import { SeriesNavigation } from "@/features/series";
import { ViewCounter } from "@/features/views";
import { Container } from "@/shared/components/layouts/Container";
import { CustomMDX } from "@/shared/components/mdx/CustomMDX";
import { getSiteUrl } from "@/shared/config/site";
import { postDetailsFixture } from "@/shared/fixtures/post-details";
import { seriesFixture } from "@/shared/fixtures/series";
import { resolveThumbnailSrc } from "@/shared/utils/resolveThumbnail";
import { normalizeSlug } from "@/shared/utils/slug";

type PostDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getPublicPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
	const { slug } = await params;

	const normalized = normalizeSlug(slug);
	if (!normalized) return { title: "Post" };

	const post = getPostBySlug(normalized);
	if (!post) return { title: "Post" };

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

	const summary = getPostBySlug(normalized);
	if (!summary) notFound();

	const detail = postDetailsFixture.find((item) => item.slug === normalized);
	const adjacent = getAdjacentPosts(summary.slug);
	const related = getRelatedPosts(summary.slug, summary.tags);
	const currentSeries = summary.series ? seriesFixture.find((item) => item.slug === summary.series) : null;
	const shareUrl = `${getSiteUrl()}/posts/${summary.slug}`;
	const thumbnailSrc = resolveThumbnailSrc(summary.thumbnail, summary.slug);

	return (
		<>
			<ReadingProgress />
			<Container>
				<div className="flex flex-col gap-10 py-8 lg:flex-row lg:gap-12 lg:py-10">
					<article className="min-w-0 flex-1 space-y-10 pb-12 sm:pb-16">
						<PostMetaHeader
							post={summary}
							shareSlot={<ShareButtons title={summary.title} url={shareUrl} />}
							viewCounterSlot={
								<Suspense
									fallback={<span className="bg-muted inline-block h-4 w-12 animate-pulse rounded" aria-hidden />}
								>
									<ViewCounter slug={summary.slug} />
								</Suspense>
							}
						/>

						{currentSeries && <SeriesNavigation series={currentSeries} currentSlug={summary.slug} />}

						{thumbnailSrc && (
							<div className="relative aspect-2/1 w-full overflow-hidden rounded-xl sm:rounded-2xl">
								<Image
									src={thumbnailSrc}
									alt={summary.title}
									fill
									priority
									className="object-cover"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
								/>
							</div>
						)}

						<section aria-label="본문" className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
							{detail ? (
								<CustomMDX source={detail.contentMdx} />
							) : (
								<p className="text-muted-foreground text-sm">본문 데이터가 없습니다.</p>
							)}
						</section>

						<PostNavigation adjacent={adjacent} />

						<RelatedPosts posts={related} />

						<CommentsSection slug={summary.slug} />
					</article>

					<aside aria-label="목차" className="hidden lg:sticky lg:top-24 lg:block lg:w-64 lg:shrink-0 lg:self-start">
						<Toc items={detail?.toc ?? []} />
					</aside>
				</div>
			</Container>
			<ScrollToTop />
		</>
	);
}
