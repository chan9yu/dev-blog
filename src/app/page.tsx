import Link from "next/link";

import { BlogPosts, TrendingPosts, TrendingTags } from "@/features/blog";
import { PopularSeries } from "@/features/series";

export default function Page() {
	return (
		<div className="flex gap-8">
			{/* Main Content */}
			<div className="min-w-0 flex-1 space-y-12">
				{/* Hero Section */}
				<section className="space-y-4 sm:space-y-6">
					<div className="space-y-3 sm:space-y-4">
						<h1
							className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							안녕하세요 👋
							<br />
							<span style={{ color: "rgb(var(--color-accent))" }}>프론트엔드 개발자</span> 입니다
						</h1>
						<p
							className="max-w-2xl text-base leading-relaxed sm:text-lg"
							style={{ color: "rgb(var(--color-text-secondary))" }}
						>
							웹 기술과 사용자 경험에 관심이 많으며, 배운 것들을 기록하고 공유합니다.
							<br className="hidden sm:block" />
							<span className="hidden sm:inline">
								React, TypeScript, Next.js를 주로 사용하며, 깨끗한 코드와 모던한 디자인을 추구합니다.
							</span>
						</p>
					</div>

					{/* Quick Links */}
					<div className="flex flex-wrap gap-3">
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
							style={{
								backgroundColor: "rgb(var(--color-bg-secondary))",
								color: "rgb(var(--color-text-primary))",
								border: "1px solid rgb(var(--color-border-primary))"
							}}
						>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
							GitHub
						</a>
						<a
							href="mailto:your@email.com"
							className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
							style={{
								backgroundColor: "rgb(var(--color-bg-secondary))",
								color: "rgb(var(--color-text-primary))",
								border: "1px solid rgb(var(--color-border-primary))"
							}}
						>
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Email
						</a>
					</div>
				</section>

				{/* Recent Posts */}
				<section className="space-y-4 sm:space-y-6">
					<div className="flex items-center justify-between">
						<h2
							className="text-xl font-bold tracking-tight sm:text-2xl"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							최근 포스트
						</h2>
						<Link
							href="/posts"
							className="text-sm font-medium transition-colors hover:underline"
							style={{ color: "rgb(var(--color-accent))" }}
						>
							전체 보기 →
						</Link>
					</div>
					<BlogPosts />
				</section>
			</div>

			{/* Sidebar */}
			<aside className="hidden w-64 lg:block">
				<div className="sticky top-24 space-y-6">
					{/* Popular Posts */}
					<section className="space-y-3">
						<h2 className="text-sm font-semibold" style={{ color: "rgb(var(--color-text-secondary))" }}>
							Popular Posts
						</h2>
						<TrendingPosts />
					</section>

					<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />

					{/* Popular Series */}
					<section className="space-y-3">
						<h2 className="text-sm font-semibold" style={{ color: "rgb(var(--color-text-secondary))" }}>
							Popular Series
						</h2>
						<PopularSeries />
					</section>

					<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />

					{/* Popular Tags */}
					<section className="space-y-3">
						<h2 className="text-sm font-semibold" style={{ color: "rgb(var(--color-text-secondary))" }}>
							Popular Tags
						</h2>
						<TrendingTags />
					</section>
				</div>
			</aside>
		</div>
	);
}
