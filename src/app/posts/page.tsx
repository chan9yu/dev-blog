import type { Metadata } from "next";

import { getPublicPosts, PostList } from "@/features/posts";
import { getTagCounts, TagList } from "@/features/tags";
import { Container } from "@/shared/components/layouts/Container";
import { buildMetadata } from "@/shared/seo";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";

export const metadata: Metadata = buildMetadata({
	title: "포스트",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록. React, TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모은 기술 글 모음으로, 태그·시리즈별로 탐색할 수 있습니다.",
	path: "/posts"
});

// SSG-first(PRD G-1) — 태그 필터링은 /tags/[tag]로 분리, 본 페이지는 정적 prerender (v1.1.2 회귀 차단).
export default function PostsPage() {
	const basePosts = getPublicPosts();
	const allTags = getTagCounts(basePosts);
	const resolvedPosts = resolvePostThumbnails(basePosts);

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
						aria-label="태그 목록"
						className="lg:max-h-sidebar hidden lg:sticky lg:top-24 lg:block lg:w-56 lg:shrink-0 lg:overflow-y-auto"
					>
						<TagList tags={allTags} variant="navigation" />
					</aside>

					<div className="min-w-0 flex-1">
						<PostList posts={resolvedPosts} />
					</div>
				</div>
			</div>
		</Container>
	);
}
