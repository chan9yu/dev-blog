"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type TagListProps = {
	tagCounts: Record<string, number>;
};

export function TagList({ tagCounts }: TagListProps) {
	const searchParams = useSearchParams();
	const selectedTag = searchParams.get("tag");

	const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-bold tracking-tight" style={{ color: "rgb(var(--color-text-primary))" }}>
				태그
			</h2>
			<div className="space-y-1.5">
				<Link
					href="/posts"
					className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[rgb(var(--color-bg-secondary))] ${
						!selectedTag ? "bg-[rgb(var(--color-bg-secondary))]" : ""
					}`}
					style={{
						color: !selectedTag ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
					}}
				>
					전체
				</Link>
				{sortedTags.map(([tag, count]) => (
					<Link
						key={tag}
						href={`/posts?tag=${encodeURIComponent(tag)}`}
						className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[rgb(var(--color-bg-secondary))] ${
							selectedTag === tag ? "bg-[rgb(var(--color-bg-secondary))]" : ""
						}`}
						style={{
							color: selectedTag === tag ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
						}}
					>
						{tag} ({count})
					</Link>
				))}
			</div>
		</div>
	);
}
