import Link from "next/link";

import type { TagCount } from "@/features/tags/types";
import { cn, slugify } from "@/shared/utils";

type TagListProps = {
	tagCounts: TagCount;
	currentTag?: string;
	variant?: "filter" | "navigation"; // filter: 쿼리 파라미터, navigation: 라우트
};

export function TagList({ tagCounts, currentTag, variant = "navigation" }: TagListProps) {
	const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

	const getTagHref = (tag: string) => {
		if (variant === "filter") {
			return `/posts?tag=${encodeURIComponent(tag)}`;
		}
		return `/tags/${slugify(tag)}`;
	};

	return (
		<div className="space-y-4">
			<h2 className="text-primary text-lg font-bold tracking-tight">태그</h2>
			<div className="space-y-1.5">
				<Link
					href="/posts"
					className={cn(
						"hover:bg-secondary block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
						!currentTag ? "bg-secondary text-accent" : "text-secondary"
					)}
				>
					전체
				</Link>
				{sortedTags.map(([tag, count]) => (
					<Link
						key={tag}
						href={getTagHref(tag)}
						className={cn(
							"hover:bg-secondary block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
							currentTag === tag ? "bg-secondary text-accent" : "text-secondary"
						)}
					>
						{tag} ({count})
					</Link>
				))}
			</div>
		</div>
	);
}
