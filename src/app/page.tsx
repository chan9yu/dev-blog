import type { Metadata } from "next";
import Link from "next/link";

import { HomeHero } from "@/features/about";
import { getPublicPosts, getTrendingPosts, PopularPosts, RecentPostsList } from "@/features/posts";
import { getTrendingSeries, TrendingSeries } from "@/features/series";
import { getTrendingTags, TrendingTags } from "@/features/tags";
import { Container } from "@/shared/components/layouts/Container";
import { buildMetadata } from "@/shared/seo";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";

export const metadata: Metadata = buildMetadata({
	title: "chan9yu | 프론트엔드 개발 블로그",
	description:
		"프론트엔드 엔지니어 chan9yu의 기술 블로그. React 19, TypeScript, Next.js App Router 실무 경험과 WebRTC, 웹 성능 최적화 등 다양한 주제를 깊이 있게 다루며 최신 학습 내용을 정리해 공유합니다.",
	path: "/"
});

// SSG-first(PRD G-1) — 트렌딩 KV 호출은 빌드 타임에 박제. 1시간 단위 갱신.
export const revalidate = 3600;

const RECENT_POSTS_LIMIT = 6;
const POPULAR_POSTS_LIMIT = 5;
const TRENDING_SERIES_LIMIT = 3;
const TRENDING_TAGS_LIMIT = 10;

export default async function HomePage() {
	const allPosts = getPublicPosts();
	const recentPosts = resolvePostThumbnails(allPosts.slice(0, RECENT_POSTS_LIMIT));

	const trending = await getTrendingPosts(allPosts, POPULAR_POSTS_LIMIT);
	const popularPosts = resolvePostThumbnails(trending.posts);

	const trendingSeries = getTrendingSeries(allPosts, TRENDING_SERIES_LIMIT);
	const trendingTags = getTrendingTags(allPosts, TRENDING_TAGS_LIMIT);

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
						<RecentPostsList posts={recentPosts} />
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
