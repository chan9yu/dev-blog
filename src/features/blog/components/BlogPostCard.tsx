"use client";

import Image from "next/image";
import Link from "next/link";

import type { PostSummary } from "@/features/blog/types";
import { calculateReadingTime, formatDate } from "@/features/blog/utils";
import ClockIcon from "@/shared/assets/icons/clock.svg";

type BlogPostCardProps = {
	post: PostSummary;
	variant?: "list" | "grid";
	priority?: boolean;
};

export function BlogPostCard({ post, variant = "list", priority = false }: BlogPostCardProps) {
	const readingTime = calculateReadingTime(post.description);

	return (
		<Link
			href={`/posts/${post.slug}`}
			className="bg-elevated border-primary group block overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
		>
			{/* Thumbnail */}
			{post.thumbnail && (
				<div className="relative aspect-[2/1] w-full overflow-hidden">
					<Image
						src={post.thumbnail}
						alt={post.title}
						fill
						priority={priority}
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>
				</div>
			)}

			<div className="p-4 sm:p-5 md:p-6 lg:p-7">
				{variant === "list" ? (
					<>
						{/* List Layout: Horizontal */}
						<div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
							<h3 className="text-primary group-hover-accent flex-1 text-base leading-snug font-bold tracking-tight text-balance break-keep transition-colors sm:text-lg md:text-xl">
								{post.title}
							</h3>
							<time className="text-muted shrink-0 text-xs tabular-nums sm:text-sm" dateTime={post.date}>
								{formatDate(post.date, false)}
							</time>
						</div>

						{/* Description */}
						<p className="text-secondary mb-3 line-clamp-2 text-sm leading-relaxed text-pretty break-keep sm:mb-4 sm:text-base">
							{post.description}
						</p>

						{/* Footer: Tags + Reading Time */}
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							{/* Tags */}
							{post.tags && post.tags.length > 0 && (
								<div className="flex flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
									{post.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="bg-tertiary text-tertiary rounded px-2 py-0.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
										>
											{tag}
										</span>
									))}
									{post.tags.length > 3 && <span className="text-muted text-xs">+{post.tags.length - 3}</span>}
								</div>
							)}

							{/* Reading Time */}
							<div className="text-muted flex shrink-0 items-center gap-1 text-xs sm:gap-1.5 sm:text-sm">
								<ClockIcon className="size-3.5 sm:size-4" aria-hidden="true" />
								<span className="hidden sm:inline">{readingTime}분</span>
								<span className="sm:hidden">{readingTime}분</span>
							</div>
						</div>
					</>
				) : (
					<>
						{/* Grid Layout: Vertical */}
						<div className="mb-2 space-y-1.5 sm:mb-3 sm:space-y-2">
							<h3 className="text-primary group-hover-accent line-clamp-2 text-base leading-snug font-bold tracking-tight text-balance break-keep transition-colors sm:text-lg md:text-xl">
								{post.title}
							</h3>
							<time className="text-muted block text-xs tabular-nums" dateTime={post.date}>
								{formatDate(post.date, false)}
							</time>
						</div>

						{/* Description */}
						<p className="text-secondary mb-3 line-clamp-2 text-xs leading-relaxed text-pretty break-keep sm:mb-4 sm:line-clamp-3 sm:text-sm">
							{post.description}
						</p>

						{/* Footer: Tags + Reading Time (Vertical) */}
						<div className="space-y-2 sm:space-y-3">
							{/* Tags - 1줄 고정 (최대 2개 태그, 길면 말줄임) */}
							{post.tags && post.tags.length > 0 && (
								<div className="flex min-w-0 items-center gap-1.5 overflow-hidden sm:gap-2">
									{post.tags.slice(0, 2).map((tag) => (
										<span
											key={tag}
											className="bg-tertiary text-tertiary max-w-[45%] truncate rounded px-2 py-0.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
										>
											{tag}
										</span>
									))}
									{post.tags.length > 2 && <span className="text-muted shrink-0 text-xs">+{post.tags.length - 2}</span>}
								</div>
							)}

							{/* Reading Time */}
							<div className="text-muted flex items-center gap-1 text-xs sm:gap-1.5">
								<ClockIcon className="size-3.5" aria-hidden="true" />
								<span>{readingTime}분</span>
							</div>
						</div>
					</>
				)}
			</div>
		</Link>
	);
}
