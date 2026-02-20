import Link from "next/link";

import { BlogPosts, getAllPosts, sortPostsByDateDescending, TrendingPosts, TrendingTags } from "@/features/blog";
import { PopularSeries } from "@/features/series";
import { PageTransition, SocialLinks } from "@/shared/components";

const RECENT_POSTS_LIMIT = 6;

export default async function Page() {
	const allPosts = await getAllPosts();
	const recentPosts = sortPostsByDateDescending(allPosts).slice(0, RECENT_POSTS_LIMIT);

	return (
		<PageTransition>
			<div className="flex flex-col gap-10 lg:flex-row">
				{/* Main Content */}
				<div className="min-w-0 flex-1 space-y-10 sm:space-y-14">
					{/* Hero Section */}
					<section className="space-y-4 sm:space-y-6">
						<div className="space-y-3 sm:space-y-4">
							<h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
								안녕하세요 👋
								<br />
								<span className="text-accent">프론트엔드 개발자</span> 여찬규입니다.
							</h1>
							<div className="text-secondary max-w-2xl space-y-3 text-sm leading-relaxed sm:space-y-4 sm:text-base md:text-lg">
								<p>
									사용자 경험과 인터페이스 개선에 중점을 두고 끊임없이 배우고 성장하는 개발자입니다.
									<br />
									디자인과 개발 사이에서 최적의 균형을 찾는 데 열정을 가지고 있습니다.
								</p>
								<p>
									이 블로그는 프론트엔드 개발 과정에서 배운 것들과 경험을 기록하고 공유하는 공간입니다.
									<br />
									React, TypeScript, 웹 성능 최적화 등 실무에서 마주하는 다양한 주제를 다룹니다.
								</p>
							</div>
						</div>

						{/* Quick Links */}
						<SocialLinks />
					</section>

					{/* Recent Posts */}
					<section className="space-y-4 sm:space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-primary flex items-center gap-2 text-lg font-bold tracking-tight sm:gap-3 sm:text-xl md:text-2xl">
								<span className="bg-accent h-6 w-1 rounded-full sm:h-7" />
								최근 포스트
							</h2>
							<Link
								href="/posts"
								className="text-accent text-xs font-medium transition-colors hover:underline sm:text-sm"
							>
								전체 보기 →
							</Link>
						</div>
						<BlogPosts posts={recentPosts} />
					</section>
				</div>

				{/* Sidebar - Hidden on mobile/tablet */}
				<aside className="hidden w-64 lg:block">
					<div className="sticky top-24 space-y-6">
						{/* Popular Posts */}
						<section className="space-y-3">
							<h2 className="text-secondary flex items-center gap-2 text-sm font-semibold">
								<span className="bg-accent size-1.5 rounded-full" />
								Popular Posts
							</h2>
							<TrendingPosts />
						</section>

						<hr className="border-primary" />

						{/* Popular Series */}
						<section className="space-y-3">
							<h2 className="text-secondary flex items-center gap-2 text-sm font-semibold">
								<span className="bg-accent size-1.5 rounded-full" />
								Popular Series
							</h2>
							<PopularSeries />
						</section>

						<hr className="border-primary" />

						{/* Popular Tags */}
						<section className="space-y-3">
							<h2 className="text-secondary flex items-center gap-2 text-sm font-semibold">
								<span className="bg-accent size-1.5 rounded-full" />
								Popular Tags
							</h2>
							<TrendingTags />
						</section>
					</div>
				</aside>
			</div>
		</PageTransition>
	);
}
