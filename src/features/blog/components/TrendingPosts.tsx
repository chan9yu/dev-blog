import Link from "next/link";

import { getAllPosts } from "@/features/blog/services";
import { formatDate, sortPostsByDateDescending } from "@/features/blog/utils";

const MAX_POSTS_DISPLAY = 5;

export async function TrendingPosts() {
	const allPosts = await getAllPosts();

	// TODO: 조회수 기능 추가 시 조회수 기준으로 정렬
	// 현재는 최신순으로 정렬
	const trendingPosts = sortPostsByDateDescending(allPosts).slice(0, MAX_POSTS_DISPLAY);

	if (trendingPosts.length === 0) {
		return (
			<div className="py-4 text-center">
				<p className="text-tertiary text-sm">아직 포스트가 없습니다</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{trendingPosts.map((post) => (
				<Link
					key={post.slug}
					href={`/posts/${post.slug}`}
					className="group block space-y-1 transition-transform hover:translate-x-1"
				>
					<h3 className="text-primary line-clamp-2 text-sm leading-tight font-medium transition-colors group-hover:!text-[var(--brand-accent)]">
						{post.title}
					</h3>
					<time
						className="text-muted block text-xs transition-colors group-hover:!text-[var(--brand-accent)]"
						dateTime={post.date}
					>
						{formatDate(post.date, false)}
					</time>
				</Link>
			))}
		</div>
	);
}
