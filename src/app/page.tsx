import Link from "next/link";

import { PopularPosts, PostCard } from "@/features/posts";
import { TrendingSeries } from "@/features/series";
import { TrendingTags } from "@/features/tags";
import { Container } from "@/shared/components/Container";
import { postsFixture } from "@/shared/fixtures/posts";
import { trendingFixture } from "@/shared/fixtures/trending";
import type { PostSummary } from "@/shared/types";
import { resolveThumbnailSrc } from "@/shared/utils/resolveThumbnail";

import { HomeHero } from "./HomeHero";

const RECENT_POSTS_LIMIT = 6;

const resolveThumbnails = (items: PostSummary[]) =>
	items.map((post) => ({ ...post, thumbnail: resolveThumbnailSrc(post.thumbnail) }));

export default function HomePage() {
	const recentPosts = resolveThumbnails(postsFixture.filter((post) => !post.private).slice(0, RECENT_POSTS_LIMIT));
	const { popularPosts, trendingSeries, trendingTags } = trendingFixture;

	return (
		<Container>
			<div className="flex flex-col gap-10 py-10 lg:flex-row lg:gap-12 lg:py-14">
				<div className="min-w-0 flex-1 space-y-14">
					<HomeHero />

					<section aria-labelledby="recent-posts-title" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2
								id="recent-posts-title"
								className="text-foreground flex items-center gap-3 text-xl font-bold tracking-tight md:text-2xl"
							>
								<span className="bg-accent h-6 w-1 rounded-full" aria-hidden />
								최근 포스트
							</h2>
							<Link
								href="/posts"
								aria-label="최근 포스트 전체 보기"
								className="text-accent focus-visible:ring-ring rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								전체 보기 <span aria-hidden>→</span>
							</Link>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{recentPosts.map((post, index) => (
								<PostCard key={post.slug} post={post} variant="grid" priority={index < 2} />
							))}
						</div>
					</section>
				</div>

				<aside
					aria-label="추천 블록"
					className="w-full space-y-8 lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:self-start"
				>
					<section aria-labelledby="popular-posts-title" className="space-y-3">
						<h2
							id="popular-posts-title"
							className="text-muted-foreground flex items-center gap-2 text-sm font-semibold"
						>
							<span className="bg-accent size-1.5 rounded-full" aria-hidden />
							<span lang="en">Popular Posts</span>
						</h2>
						<PopularPosts posts={popularPosts} />
					</section>

					<hr className="border-border-subtle" />

					<section aria-labelledby="trending-series-title" className="space-y-3">
						<h2
							id="trending-series-title"
							className="text-muted-foreground flex items-center gap-2 text-sm font-semibold"
						>
							<span className="bg-accent size-1.5 rounded-full" aria-hidden />
							<span lang="en">Trending Series</span>
						</h2>
						<TrendingSeries series={trendingSeries} />
					</section>

					<hr className="border-border-subtle" />

					<section aria-labelledby="trending-tags-title" className="space-y-3">
						<h2
							id="trending-tags-title"
							className="text-muted-foreground flex items-center gap-2 text-sm font-semibold"
						>
							<span className="bg-accent size-1.5 rounded-full" aria-hidden />
							<span lang="en">Trending Tags</span>
						</h2>
						<TrendingTags tags={trendingTags} />
					</section>
				</aside>
			</div>
		</Container>
	);
}
