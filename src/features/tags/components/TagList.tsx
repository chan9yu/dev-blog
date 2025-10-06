import Link from "next/link";

import type { TagCount } from "../types";

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
		return `/tags/${encodeURIComponent(tag)}`;
	};

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-bold tracking-tight" style={{ color: "rgb(var(--color-text-primary))" }}>
				태그
			</h2>
			<div className="space-y-1.5">
				<Link
					href="/posts"
					className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[rgb(var(--color-bg-secondary))] ${
						!currentTag ? "bg-[rgb(var(--color-bg-secondary))]" : ""
					}`}
					style={{
						color: !currentTag ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
					}}
				>
					전체
				</Link>
				{sortedTags.map(([tag, count]) => (
					<Link
						key={tag}
						href={getTagHref(tag)}
						className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[rgb(var(--color-bg-secondary))] ${
							currentTag === tag ? "bg-[rgb(var(--color-bg-secondary))]" : ""
						}`}
						style={{
							color: currentTag === tag ? "rgb(var(--color-accent))" : "rgb(var(--color-text-secondary))"
						}}
					>
						{tag} ({count})
					</Link>
				))}
			</div>
		</div>
	);
}
