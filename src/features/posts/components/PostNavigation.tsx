import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { AdjacentPosts } from "@/shared/types";

type PostNavigationProps = {
	adjacent: AdjacentPosts;
};

/**
 * 레거시 PostNavigation 디자인:
 * - mt-12 sm:mt-16 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2
 * - 각 카드: bg-muted border rounded-lg p-4 sm:p-6, hover lift
 * - 상단: 이전/다음 라벨 + chevron / 제목 text-sm sm:text-base font-semibold
 */
export function PostNavigation({ adjacent }: PostNavigationProps) {
	const { prev, next } = adjacent;
	if (!prev && !next) return null;

	return (
		<nav aria-label="이전/다음 포스트" className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-2">
			{prev ? (
				<Link
					href={`/posts/${prev.slug}`}
					className="group bg-muted border-border-subtle hover:bg-muted/70 focus-visible:ring-ring flex min-h-11 flex-col gap-1.5 rounded-lg border p-4 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:p-6"
				>
					<span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						<ChevronLeft className="size-3.5 sm:size-4" aria-hidden />
						이전 글
					</span>
					<h3 className="text-foreground group-hover:text-accent line-clamp-2 text-sm font-semibold text-balance break-keep transition-colors sm:text-base">
						{prev.title}
					</h3>
				</Link>
			) : (
				<div aria-hidden />
			)}

			{next ? (
				<Link
					href={`/posts/${next.slug}`}
					className="group bg-muted border-border-subtle hover:bg-muted/70 focus-visible:ring-ring flex min-h-11 flex-col gap-1.5 rounded-lg border p-4 text-right transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:p-6"
				>
					<span className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						다음 글
						<ChevronRight className="size-3.5 sm:size-4" aria-hidden />
					</span>
					<h3 className="text-foreground group-hover:text-accent line-clamp-2 text-sm font-semibold text-balance break-keep transition-colors sm:text-base">
						{next.title}
					</h3>
				</Link>
			) : (
				<div aria-hidden />
			)}
		</nav>
	);
}
