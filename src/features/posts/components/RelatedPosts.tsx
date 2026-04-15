import type { RelatedPost } from "@/shared/types";

import { PostCard } from "./PostCard";

type RelatedPostsProps = {
	posts: RelatedPost[];
};

/**
 * 레거시 RelatedPosts 디자인:
 * - section mt-12 sm:mt-16
 * - h2 mb-6 sm:mb-8 accent bar + "이런 글도 읽어보세요"
 * - 그리드 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6
 * - 각 아이템: PostCard variant="grid" 재사용
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
	if (posts.length === 0) return null;

	return (
		<section aria-labelledby="related-posts-title" className="mt-12 sm:mt-16">
			<h2
				id="related-posts-title"
				className="text-foreground mb-6 flex items-center gap-2 text-lg font-bold tracking-tight sm:mb-8 sm:gap-3 sm:text-xl md:text-2xl"
			>
				<span className="bg-accent h-6 w-1 rounded-full sm:h-7" aria-hidden />
				이런 글도 읽어보세요
			</h2>
			<div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
				{posts.slice(0, 3).map((post) => (
					<PostCard key={post.slug} post={post} variant="grid" />
				))}
			</div>
		</section>
	);
}
