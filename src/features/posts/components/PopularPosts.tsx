import Link from "next/link";

import type { PostSummary } from "@/shared/types";
import { formatDate } from "@/shared/utils/formatDate";

type PopularPostsProps = {
	posts: PostSummary[];
};

export function PopularPosts({ posts }: PopularPostsProps) {
	if (posts.length === 0) {
		return <p className="text-muted-foreground text-sm">아직 포스트가 없습니다.</p>;
	}

	return (
		<ol className="space-y-3">
			{posts.map((post, index) => {
				const rank = index + 1;
				return (
					<li key={post.slug}>
						<Link
							href={`/posts/${post.slug}`}
							aria-label={`인기 포스트 ${rank}위: ${post.title}`}
							className="group focus-visible:ring-ring flex gap-3 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<span className="text-muted-foreground text-sm font-semibold tabular-nums" aria-hidden>
								{String(rank).padStart(2, "0")}
							</span>
							<div className="min-w-0 flex-1 space-y-0.5">
								<h3 className="text-card-foreground group-hover:text-accent line-clamp-2 text-sm leading-snug font-medium transition-colors">
									{post.title}
								</h3>
								<time className="text-muted-foreground block text-xs tabular-nums" dateTime={post.date}>
									{formatDate(post.date)}
								</time>
							</div>
						</Link>
					</li>
				);
			})}
		</ol>
	);
}
