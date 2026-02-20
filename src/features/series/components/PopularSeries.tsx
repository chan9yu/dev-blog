import Link from "next/link";

import { getTrendingSeries } from "@/features/series/services";

const MAX_SERIES_DISPLAY = 5;

export async function PopularSeries() {
	const popularSeries = await getTrendingSeries(MAX_SERIES_DISPLAY);

	if (popularSeries.length === 0) {
		return (
			<div className="py-4 text-center">
				<p className="text-tertiary text-sm">아직 시리즈가 없습니다</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{popularSeries.map((series) => (
				<Link
					key={series.slug}
					href={`/series/${series.slug}`}
					className="group flex items-center justify-between transition-all hover:translate-x-1"
				>
					<span className="text-primary text-sm font-medium transition-colors group-hover:!text-[var(--brand-accent)]">
						{series.name}
					</span>
					<span className="text-muted text-xs transition-colors group-hover:!text-[var(--brand-accent)]">
						{series.count}개
					</span>
				</Link>
			))}
		</div>
	);
}
