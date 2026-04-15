import Link from "next/link";

import type { Series } from "@/shared/types";

type TrendingSeriesProps = {
	series: Series[];
};

/**
 * 레거시 PopularSeries 디자인 참조:
 * - space-y-3
 * - 각 Link: group flex items-center justify-between, hover translate-x-1
 * - 좌: 시리즈명 text-sm font-medium
 * - 우: 편 수 text-xs
 */
export function TrendingSeries({ series }: TrendingSeriesProps) {
	if (series.length === 0) {
		return <p className="text-muted-foreground text-sm">아직 시리즈가 없습니다.</p>;
	}

	return (
		<ul className="space-y-3">
			{series.map((item) => (
				<li key={item.slug}>
					<Link
						href={`/series/${item.slug}`}
						className="group focus-visible:ring-ring flex items-center justify-between gap-3 rounded transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:translate-x-1"
					>
						<span className="text-card-foreground group-hover:text-accent group-focus-visible:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{item.name}
						</span>
						<span className="text-muted-foreground shrink-0 text-xs tabular-nums">{item.posts.length}편</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
