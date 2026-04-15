import { Calendar, Tag } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { ViewCounter } from "@/features/views";
import type { PostSummary } from "@/shared/types";
import { formatDate } from "@/shared/utils/formatDate";

type PostMetaHeaderProps = {
	post: PostSummary;
	shareSlot?: ReactNode;
};

/**
 * 레거시 포스트 상세 header 디자인:
 * - h1 (text-2xl ~ lg:text-5xl, leading-tight, text-balance, break-keep)
 * - 설명 (text-base sm:text-lg, leading-relaxed, text-pretty)
 * - Meta row: 좌측 날짜(Calendar) + 우측 조회수(Eye + ViewCounter), justify-between
 * - Tags + Share row: 좌 태그 Link(bg-muted border-border + lift hover) + 우 Share
 * - 하단 hr border-border
 */
export function PostMetaHeader({ post, shareSlot }: PostMetaHeaderProps) {
	return (
		<header className="mb-10 space-y-5 sm:mb-14 sm:space-y-7">
			<div className="space-y-4 sm:space-y-5">
				<h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-3xl md:text-4xl lg:text-5xl">
					{post.title}
				</h1>
				<p className="text-muted-foreground text-base leading-relaxed text-pretty break-keep sm:text-lg">
					{post.description}
				</p>
			</div>

			<div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
				<time dateTime={post.date} className="flex items-center gap-1.5 sm:gap-2">
					<Calendar className="size-3.5 sm:size-4" aria-hidden />
					{formatDate(post.date)}
				</time>
				<Suspense fallback={<span className="bg-muted inline-block h-4 w-12 animate-pulse rounded" aria-hidden />}>
					<ViewCounter slug={post.slug} />
				</Suspense>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
				{post.tags.length > 0 && (
					<ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="태그">
						{post.tags.map((tag) => (
							<li key={tag}>
								<Link
									href={`/tags/${tag}`}
									className="bg-muted text-muted-foreground border-border-subtle focus-visible:ring-ring inline-flex min-h-9 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.03] sm:px-3 sm:text-sm"
								>
									<Tag className="size-3 sm:size-3.5" aria-hidden />
									{tag}
								</Link>
							</li>
						))}
					</ul>
				)}
				{shareSlot}
			</div>

			<hr className="border-border" />
		</header>
	);
}
