import Link from "next/link";

import { getTrendingTags } from "../services";

const MAX_TAGS_DISPLAY = 10;

export async function TrendingTags() {
	const trendingTags = await getTrendingTags(MAX_TAGS_DISPLAY);

	if (trendingTags.length === 0) {
		return (
			<div className="py-4 text-center">
				<p className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
					아직 태그가 없습니다
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-2">
			{trendingTags.map((tag) => (
				<Link
					key={tag.name}
					href={`/tags/${encodeURIComponent(tag.name)}`}
					className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all hover:scale-105 hover:!bg-[rgb(var(--color-bg-secondary))] hover:!text-[rgb(var(--color-accent))]"
					style={{
						backgroundColor: "rgb(var(--color-bg-secondary))",
						color: "rgb(var(--color-text-secondary))"
					}}
				>
					{tag.name}
					<span className="text-[10px]" style={{ color: "rgb(var(--color-text-muted))" }}>
						{tag.count}
					</span>
				</Link>
			))}
		</div>
	);
}
