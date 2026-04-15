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
	items.map((post) => ({ ...post, thumbnail: resolveThumbnailSrc(post.thumbnail, post.slug) }));

export default function HomePage() {
	const recentPosts = resolveThumbnails(postsFixture.filter((post) => !post.private).slice(0, RECENT_POSTS_LIMIT));
	const { popularPosts, trendingSeries, trendingTags } = trendingFixture;

	return (
		<Container>
			<div className="flex flex-col gap-10 py-8 lg:flex-row lg:py-10">
				<div className="min-w-0 flex-1 space-y-10 sm:space-y-14">
					<HomeHero />

					<section aria-labelledby="recent-posts-title" className="space-y-4 sm:space-y-6">
						<div className="flex items-center justify-between">
							<h2
								id="recent-posts-title"
								className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight sm:gap-3 sm:text-xl md:text-2xl"
							>
								<span className="bg-accent h-6 w-1 rounded-full sm:h-7" aria-hidden />
								최근 포스트
							</h2>
							<Link
								href="/posts"
								aria-label="최근 포스트 전체 보기"
								className="text-accent focus-visible:ring-ring rounded text-xs font-medium transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:text-sm"
							>
								전체 보기 <span aria-hidden>→</span>
							</Link>
						</div>
						<div className="flex flex-col gap-6">
							{recentPosts.map((post, index) => (
								<PostCard key={post.slug} post={post} variant="list" priority={index < 2} />
							))}
						</div>
					</section>
				</div>

				<aside aria-label="추천 블록" className="hidden lg:block lg:w-64 lg:shrink-0">
					<div className="sticky top-24 space-y-6">
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

						<hr className="border-border" />

						<section aria-labelledby="trending-series-title" className="space-y-3">
							<h2
								id="trending-series-title"
								className="text-muted-foreground flex items-center gap-2 text-sm font-semibold"
							>
								<span className="bg-accent size-1.5 rounded-full" aria-hidden />
								<span lang="en">Popular Series</span>
							</h2>
							<TrendingSeries series={trendingSeries} />
						</section>

						<hr className="border-border" />

						<section aria-labelledby="trending-tags-title" className="space-y-3">
							<h2
								id="trending-tags-title"
								className="text-muted-foreground flex items-center gap-2 text-sm font-semibold"
							>
								<span className="bg-accent size-1.5 rounded-full" aria-hidden />
								<span lang="en">Popular Tags</span>
							</h2>
							<TrendingTags tags={trendingTags} />
						</section>
					</div>
				</aside>
			</div>
		</Container>
	);
}
