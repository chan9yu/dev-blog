import type { Metadata } from "next";
import { Suspense } from "react";

import { getPublicPosts, PostList, PostListSkeleton } from "@/features/posts";
import { getTagCounts, TagList } from "@/features/tags";
import { Container } from "@/shared/components/layouts/Container";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";

type PostsPageProps = {
	searchParams: Promise<{ tag?: string }>;
};

export const metadata: Metadata = {
	title: "포스트",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록. React, TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모은 기술 글 모음입니다.",
	alternates: { canonical: "/posts" }
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
	const { tag } = await searchParams;

	const basePosts = getPublicPosts();
	const allTags = getTagCounts(basePosts);
	const filtered = tag ? basePosts.filter((post) => post.tags.includes(tag)) : basePosts;
	const resolvedPosts = resolvePostThumbnails(filtered);

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">포스트</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						개발하면서 배운 것들을 기록합니다
					</p>
				</header>

				<div className="flex gap-8">
					<aside
						aria-label="태그 필터"
						className="lg:max-h-sidebar hidden lg:sticky lg:top-24 lg:block lg:w-56 lg:shrink-0 lg:overflow-y-auto"
					>
						<TagList tags={allTags} currentTag={tag} variant="filter" />
					</aside>

					<div className="min-w-0 flex-1">
						<Suspense fallback={<PostListSkeleton count={6} />}>
							<PostList posts={resolvedPosts} />
						</Suspense>
					</div>
				</div>
			</div>
		</Container>
	);
}
