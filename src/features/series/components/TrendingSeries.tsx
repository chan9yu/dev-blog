import Link from "next/link";

import type { Series } from "@/shared/types";

type TrendingSeriesProps = {
	series: Series[];
};

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
						aria-label={`${item.name}, 총 ${item.posts.length}편`}
						className="group focus-visible:ring-ring block space-y-0.5 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<h3 className="text-card-foreground group-hover:text-accent line-clamp-2 text-sm leading-snug font-medium transition-colors">
							{item.name}
						</h3>
						<p className="text-muted-foreground text-xs" aria-hidden>
							{item.posts.length}편
						</p>
					</Link>
				</li>
			))}
		</ul>
	);
}
