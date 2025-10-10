"use client";

import Image from "next/image";
import Link from "next/link";

import ClockIcon from "@/assets/icons/clock.svg";

import type { PostSummary } from "../types";
import { calculateReadingTime, formatDate } from "../utils";

type BlogPostCardProps = {
	post: PostSummary;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
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
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			)}

			<div style={{ padding: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
				{/* Header: Title + Date */}
				<div className="mb-3 flex items-start justify-between gap-4">
					<h3
						className="text-primary flex-1 font-bold tracking-tight transition-colors group-hover:text-[rgb(var(--color-accent))]"
						style={{
							fontSize: "var(--font-xl)",
							lineHeight: "var(--leading-snug)"
						}}
					>
						{post.title}
					</h3>
					<time
						className="text-muted shrink-0 tabular-nums"
						dateTime={post.date}
						style={{ fontSize: "var(--font-sm)" }}
					>
						{formatDate(post.date, false)}
					</time>
				</div>

				{/* Description */}
				<p
					className="text-secondary mb-4 line-clamp-2"
					style={{
						fontSize: "var(--font-base)",
						lineHeight: "var(--leading-relaxed)"
					}}
				>
					{post.description}
				</p>

				{/* Footer: Tags + Reading Time */}
				<div className="flex flex-wrap items-center gap-3">
					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-1 flex-wrap items-center gap-2">
							{post.tags.map((tag) => (
								<span key={tag} className="bg-tertiary text-tertiary rounded px-2 py-0.5 text-xs font-medium">
									{tag}
								</span>
							))}
						</div>
					)}

					{/* Reading Time */}
					<div className="text-muted flex shrink-0 items-center gap-1.5" style={{ fontSize: "var(--font-sm)" }}>
						<ClockIcon className="size-4" />
						<span>{readingTime}분 읽기</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
