import type { Metadata } from "next";
import { Suspense } from "react";

import { PostList, PostListSkeleton } from "@/features/posts";
import { Container } from "@/shared/components/Container";
import { postsFixture } from "@/shared/fixtures/posts";
import { tagsFixture } from "@/shared/fixtures/tags";
import { resolveThumbnailSrc } from "@/shared/utils/resolveThumbnail";

export const metadata: Metadata = {
	title: "Posts",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록. React, TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모은 기술 글 모음입니다.",
	alternates: { canonical: "/posts" }
};

export default function PostsPage() {
	const publicPosts = postsFixture
		.filter((post) => !post.private)
		.map((post) => ({ ...post, thumbnail: resolveThumbnailSrc(post.thumbnail) }));

	return (
		<Container>
			<div className="space-y-10 py-10 lg:py-14">
				<header className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Posts</h1>
					<p className="text-muted-foreground text-sm">총 {publicPosts.length}개의 글</p>
				</header>
				<Suspense fallback={<PostListSkeleton />}>
					<PostList posts={publicPosts} tags={tagsFixture} />
				</Suspense>
			</div>
		</Container>
	);
}
