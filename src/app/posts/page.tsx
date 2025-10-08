import type { Metadata } from "next";
import { Suspense } from "react";

import { FilteredBlogPosts, getAllPosts } from "@/features/blog";
import { getTagCounts, TagList } from "@/features/tags";

export const metadata: Metadata = {
	title: "블로그",
	description: "개발 관련 글을 작성합니다."
};

export default async function Page({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
	const [posts, tagCounts] = await Promise.all([getAllPosts(), getTagCounts()]);
	const { tag } = await searchParams;

	return (
		<div className="space-y-8">
			{/* Header */}
			<header className="space-y-3">
				<h1
					className="text-2xl font-bold tracking-tight sm:text-3xl"
					style={{ color: "rgb(var(--color-text-primary))" }}
				>
					포스트
				</h1>
				<p className="text-sm leading-relaxed sm:text-base" style={{ color: "rgb(var(--color-text-secondary))" }}>
					개발하면서 배운 것들을 기록합니다
				</p>
			</header>

			{/* Content */}
			<div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
				{/* Sidebar - Tags */}
				<aside className="lg:sticky lg:top-24 lg:h-fit">
					<TagList tagCounts={tagCounts} currentTag={tag} variant="filter" />
				</aside>

				{/* Main - Posts */}
				<main className="min-w-0">
					<Suspense
						fallback={
							<div className="flex items-center justify-center py-12">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
							</div>
						}
					>
						<FilteredBlogPosts posts={posts} selectedTag={tag} />
					</Suspense>
				</main>
			</div>
		</div>
	);
}
