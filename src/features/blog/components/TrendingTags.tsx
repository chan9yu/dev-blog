import Link from "next/link";

import { getTrendingTags } from "@/features/blog/services";
import { slugify } from "@/shared/utils";

const MAX_TAGS_DISPLAY = 10;

export async function TrendingTags() {
	const trendingTags = await getTrendingTags(MAX_TAGS_DISPLAY);

	if (trendingTags.length === 0) {
		return (
			<div className="py-4 text-center">
				<p className="text-tertiary text-sm">아직 태그가 없습니다</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-2">
			{trendingTags.map((tag) => (
				<Link
					key={tag.name}
					href={`/tags/${slugify(tag.name)}`}
					className="bg-secondary text-secondary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all hover:scale-105 hover:!bg-[var(--bg-secondary)] hover:!text-[var(--brand-accent)]"
				>
					{tag.name}
					<span className="text-muted text-[10px]">{tag.count}</span>
				</Link>
			))}
		</div>
	);
}
