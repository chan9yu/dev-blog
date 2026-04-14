import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/formatDate";

type PostCardProps = {
	post: PostSummary;
	variant?: "list" | "grid";
	priority?: boolean;
};

export function PostCard({ post, variant = "grid", priority = false }: PostCardProps) {
	const maxTags = variant === "list" ? 3 : 2;
	const visibleTags = post.tags.slice(0, maxTags);
	const hiddenCount = post.tags.length - visibleTags.length;

	return (
		<Link
			href={`/posts/${post.slug}`}
			className={cn(
				"group bg-card border-border block overflow-hidden rounded-xl border shadow-sm transition-all duration-300",
				"hover:shadow-lg motion-safe:hover:-translate-y-1",
				"focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			)}
		>
			{post.thumbnail && (
				<div className="relative aspect-video w-full overflow-hidden">
					<Image
						src={post.thumbnail}
						alt=""
						fill
						priority={priority}
						className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				</div>
			)}
			<div className="p-5">
				<div
					className={cn(
						"mb-3 flex gap-2",
						variant === "list" ? "flex-col sm:flex-row sm:items-start sm:justify-between" : "flex-col"
					)}
				>
					<h3 className="text-card-foreground group-hover:text-accent line-clamp-2 flex-1 text-lg leading-snug font-bold tracking-tight transition-colors">
						{post.title}
					</h3>
					<time className="text-muted-foreground shrink-0 text-xs tabular-nums" dateTime={post.date}>
						{formatDate(post.date)}
					</time>
				</div>
				<p
					className={cn(
						"text-muted-foreground mb-4 text-sm leading-relaxed",
						variant === "list" ? "line-clamp-2" : "line-clamp-3"
					)}
				>
					{post.description}
				</p>
				<div className="flex flex-wrap items-center gap-2">
					{visibleTags.length > 0 && (
						<div className="flex flex-1 flex-wrap items-center gap-1.5">
							{visibleTags.map((tag) => (
								<span key={tag} className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium">
									{tag}
								</span>
							))}
							{hiddenCount > 0 && <span className="text-muted-foreground text-xs">+{hiddenCount}</span>}
						</div>
					)}
					<div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
						<Clock className="size-3.5" aria-hidden />
						<span>{post.readingTimeMinutes}분</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
