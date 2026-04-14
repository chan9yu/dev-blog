import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { PostSummary, Series } from "@/shared/types";

type SeriesNavigationProps = {
	series: Series;
	currentSlug: string;
};

function findAdjacentInSeries(series: Series, currentSlug: string) {
	const ordered = [...series.posts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
	const index = ordered.findIndex((post) => post.slug === currentSlug);
	if (index === -1) return { prev: null as PostSummary | null, next: null as PostSummary | null };
	return {
		prev: index > 0 ? (ordered[index - 1] ?? null) : null,
		next: index < ordered.length - 1 ? (ordered[index + 1] ?? null) : null
	};
}

export function SeriesNavigation({ series, currentSlug }: SeriesNavigationProps) {
	const { prev, next } = findAdjacentInSeries(series, currentSlug);
	const currentPost = series.posts.find((post) => post.slug === currentSlug);
	if (!currentPost) return null;

	return (
		<aside className="bg-muted border-border-subtle space-y-3 rounded-lg border p-4">
			<div className="flex items-center gap-2 text-xs">
				<span className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 font-semibold">시리즈</span>
				<Link
					href={`/series/${series.slug}`}
					className="text-foreground hover:text-accent focus-visible:text-accent text-sm font-medium focus-visible:outline-none"
				>
					{series.name}
				</Link>
				<span className="text-muted-foreground">
					{currentPost.seriesOrder}/{series.posts.length}
				</span>
			</div>
			<div className="grid gap-2 sm:grid-cols-2">
				{prev && (
					<Link
						href={`/posts/${prev.slug}`}
						className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center gap-1 rounded text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<ChevronLeft className="size-3.5 shrink-0" aria-hidden />
						<span className="line-clamp-1">{prev.title}</span>
					</Link>
				)}
				{next && (
					<Link
						href={`/posts/${next.slug}`}
						className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center justify-end gap-1 rounded text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:col-start-2"
					>
						<span className="line-clamp-1">{next.title}</span>
						<ChevronRight className="size-3.5 shrink-0" aria-hidden />
					</Link>
				)}
			</div>
		</aside>
	);
}
