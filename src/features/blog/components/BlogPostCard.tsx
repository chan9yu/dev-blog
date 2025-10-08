"use client";

import Link from "next/link";

import type { PostSummary } from "../types";
import { calculateReadingTime, formatDate } from "../utils";

type BlogPostCardProps = {
	post: PostSummary;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
	const readingTime = calculateReadingTime(post.short_description);

	return (
		<Link
			href={`/posts/${post.url_slug}`}
			className="group block overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1"
			style={{
				backgroundColor: "rgb(var(--color-bg-elevated))",
				borderColor: "rgb(var(--color-border-primary))",
				boxShadow: "var(--shadow-sm)"
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.boxShadow = "var(--shadow-lg)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.boxShadow = "var(--shadow-sm)";
			}}
		>
			<div
				style={{
					padding: "clamp(1.25rem, 2.5vw, 1.75rem)"
				}}
			>
				{/* Header: Title + Date */}
				<div className="mb-3 flex items-start justify-between gap-4">
					<h3
						className="flex-1 font-bold tracking-tight transition-colors group-hover:text-[rgb(var(--color-accent))]"
						style={{
							fontSize: "var(--font-xl)",
							lineHeight: "var(--leading-snug)",
							color: "rgb(var(--color-text-primary))"
						}}
					>
						{post.title}
					</h3>
					<time
						className="shrink-0 tabular-nums"
						dateTime={post.released_at}
						style={{
							fontSize: "var(--font-sm)",
							color: "rgb(var(--color-text-muted))"
						}}
					>
						{formatDate(post.released_at, false)}
					</time>
				</div>

				{/* Description */}
				<p
					className="mb-4 line-clamp-2"
					style={{
						fontSize: "var(--font-base)",
						lineHeight: "var(--leading-relaxed)",
						color: "rgb(var(--color-text-secondary))"
					}}
				>
					{post.short_description}
				</p>

				{/* Footer: Tags + Reading Time */}
				<div className="flex flex-wrap items-center gap-3">
					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-1 flex-wrap items-center gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="rounded px-2 py-0.5 text-xs font-medium"
									style={{
										backgroundColor: "rgb(var(--color-bg-tertiary))",
										color: "rgb(var(--color-text-tertiary))"
									}}
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{/* Reading Time */}
					<div
						className="flex shrink-0 items-center gap-1.5"
						style={{
							fontSize: "var(--font-sm)",
							color: "rgb(var(--color-text-muted))"
						}}
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{readingTime}분 읽기</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
