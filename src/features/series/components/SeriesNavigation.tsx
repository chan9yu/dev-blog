import { BookOpen, ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";

import type { Series } from "@/shared/types";

import { getAdjacentInSeries } from "../services";

type SeriesNavigationProps = {
	series: Series;
	currentSlug: string;
};

/**
 * 레거시 SeriesNavigation 디자인:
 * - bg-muted rounded-xl p-6
 * - 헤더 row: BookOpen 아이콘 배경 box + "시리즈" label + 시리즈명 + 인덱스(N/M)
 * - 이전/다음 버튼 2개 (bg-card rounded-lg p-3, 없으면 opacity-50)
 * - 하단: 시리즈 전체 보기 버튼 (List 아이콘)
 */
export function SeriesNavigation({ series, currentSlug }: SeriesNavigationProps) {
	const { prev, next, order, total } = getAdjacentInSeries(series, currentSlug);
	if (order === null) return null;

	return (
		<aside className="bg-muted border-border-subtle space-y-4 rounded-xl border p-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="bg-card flex size-8 items-center justify-center rounded-lg">
						<BookOpen className="text-accent size-4" aria-hidden />
					</div>
					<div>
						<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">시리즈</p>
						<Link
							href={`/series/${series.slug}`}
							className="text-foreground hover:text-accent focus-visible:text-accent font-semibold transition-colors focus-visible:outline-none"
						>
							{series.name}
						</Link>
					</div>
				</div>
				<span className="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
					{order} / {total}
				</span>
			</div>

			<div className="flex gap-3">
				{prev ? (
					<Link
						href={`/posts/${prev.slug}`}
						className="group bg-card border-border-subtle focus-visible:ring-ring flex flex-1 flex-col gap-1 rounded-lg border p-3 transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
							<ChevronLeft className="size-3" aria-hidden />
							이전 글
						</span>
						<span className="text-foreground group-hover:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{prev.title}
						</span>
					</Link>
				) : (
					<div
						aria-hidden
						className="bg-card border-border-subtle flex flex-1 flex-col gap-1 rounded-lg border p-3 opacity-50"
					>
						<span className="text-muted-foreground text-xs font-medium">이전 글</span>
						<span className="text-muted-foreground text-sm">첫 번째 글입니다</span>
					</div>
				)}

				{next ? (
					<Link
						href={`/posts/${next.slug}`}
						className="group bg-card border-border-subtle focus-visible:ring-ring flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span className="text-muted-foreground flex items-center justify-end gap-1 text-xs font-medium">
							다음 글
							<ChevronRight className="size-3" aria-hidden />
						</span>
						<span className="text-foreground group-hover:text-accent line-clamp-1 text-sm font-medium transition-colors">
							{next.title}
						</span>
					</Link>
				) : (
					<div
						aria-hidden
						className="bg-card border-border-subtle flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right opacity-50"
					>
						<span className="text-muted-foreground text-xs font-medium">다음 글</span>
						<span className="text-muted-foreground text-sm">마지막 글입니다</span>
					</div>
				)}
			</div>

			<Link
				href={`/series/${series.slug}`}
				className="bg-card border-border-subtle text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<List className="size-4" aria-hidden />
				시리즈 전체 보기
			</Link>
		</aside>
	);
}
