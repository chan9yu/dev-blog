import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { AdjacentPosts } from "@/shared/types";

type PostNavigationProps = {
	adjacent: AdjacentPosts;
};

export function PostNavigation({ adjacent }: PostNavigationProps) {
	const { prev, next } = adjacent;
	if (!prev && !next) return null;

	return (
		<nav aria-label="이전/다음 포스트" className="grid gap-4 sm:grid-cols-2">
			{prev ? (
				<Link
					href={`/posts/${prev.slug}`}
					className="group bg-card border-border hover:border-accent focus-visible:ring-ring block rounded-lg border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<div className="text-muted-foreground inline-flex items-center gap-1 text-xs">
						<ChevronLeft className="size-3.5" aria-hidden />
						이전 글
					</div>
					<p className="text-card-foreground group-hover:text-accent mt-2 line-clamp-2 text-sm font-medium transition-colors">
						{prev.title}
					</p>
				</Link>
			) : (
				<div />
			)}
			{next ? (
				<Link
					href={`/posts/${next.slug}`}
					className="group bg-card border-border hover:border-accent focus-visible:ring-ring block rounded-lg border p-4 text-right transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<div className="text-muted-foreground inline-flex items-center gap-1 text-xs">
						다음 글
						<ChevronRight className="size-3.5" aria-hidden />
					</div>
					<p className="text-card-foreground group-hover:text-accent mt-2 line-clamp-2 text-sm font-medium transition-colors">
						{next.title}
					</p>
				</Link>
			) : (
				<div />
			)}
		</nav>
	);
}
