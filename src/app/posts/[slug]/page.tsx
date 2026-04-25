import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CommentsSection } from "@/features/comments";
import {
	findAdjacentPosts,
	findRelatedPostsByTags,
	getPostBySlug,
	getPostDetail,
	getPublicPosts,
	PostMetaHeader,
	PostNavigation,
	PostTocAside,
	ReadingProgress,
	RelatedPosts,
	ShareButtons
} from "@/features/posts";
import { getSeriesDetail, SeriesNavigation } from "@/features/series";
import { ViewCounter } from "@/features/views";
import { Container } from "@/shared/components/layouts/Container";
import { CustomMDX } from "@/shared/components/mdx/CustomMDX";
import { getSiteUrl } from "@/shared/config/site";
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

	const detail = getPostDetail(normalized);
	if (!detail) notFound();

	// 전체 포스트를 변수로 캐싱 — find* 함수들과 getSeriesDetail이 같은 입력을 공유한다.
	const allPosts = getPublicPosts();
	const adjacent = findAdjacentPosts(allPosts, summary.slug);
	const related = findRelatedPostsByTags(allPosts, summary);
	const currentSeries = summary.series ? getSeriesDetail(allPosts, summary.series) : null;
	const shareUrl = `${getSiteUrl()}/posts/${summary.slug}`;
	const thumbnailSrc = resolveThumbnailSrc(summary.thumbnail, summary.slug);

	return (
		<>
			<ReadingProgress />
			<Container>
				<div className="flex flex-col py-8 lg:flex-row lg:py-10">
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
							<CustomMDX source={detail.contentMdx} />
						</section>

						<PostNavigation adjacent={adjacent} />

						<RelatedPosts posts={related} />

						<CommentsSection slug={summary.slug} isPrivate={summary.private} />
					</article>

					<PostTocAside items={detail.toc} />
				</div>
			</Container>
		</>
	);
}
