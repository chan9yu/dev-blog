import Link from "next/link";

import type { RelatedPost } from "@/shared/types";
import { formatDate } from "@/shared/utils/formatDate";

type RelatedPostsProps = {
	posts: RelatedPost[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
	if (posts.length === 0) return null;

	return (
		<section aria-labelledby="related-posts-title" className="space-y-4">
			<h2 id="related-posts-title" className="text-foreground text-xl font-bold tracking-tight">
				관련 글
			</h2>
			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{posts.slice(0, 3).map((post) => (
					<li key={post.slug}>
						<Link
							href={`/posts/${post.slug}`}
							className="group bg-card border-border focus-visible:ring-ring block rounded-lg border p-4 transition-colors hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<h3 className="text-card-foreground group-hover:text-accent line-clamp-2 text-sm font-medium transition-colors">
								{post.title}
							</h3>
							<time className="text-muted-foreground mt-2 block text-xs tabular-nums" dateTime={post.date}>
								{formatDate(post.date)}
							</time>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
