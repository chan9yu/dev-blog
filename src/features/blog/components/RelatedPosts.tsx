import type { PostSummary } from "@/features/blog/types";

import { BlogPostCard } from "./BlogPostCard";

type RelatedPostsProps = {
	posts: PostSummary[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
	if (posts.length === 0) {
		return null;
	}

	return (
		<section className="mt-12 sm:mt-16">
			<h2 className="text-primary mb-6 flex items-center gap-2 text-lg font-bold tracking-tight sm:mb-8 sm:gap-3 sm:text-xl md:text-2xl">
				<span className="bg-accent h-6 w-1 rounded-full sm:h-7" />
				이런 글도 읽어보세요
			</h2>
			<div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
				{posts.map((post) => (
					<BlogPostCard key={post.slug} post={post} variant="grid" />
				))}
			</div>
		</section>
	);
}
