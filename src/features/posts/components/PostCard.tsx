import { cva } from "class-variance-authority";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/formatDate";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

const cardImageWrapper = cva("relative w-full overflow-hidden", {
	variants: {
		variant: {
			list: "aspect-2/1",
			grid: "aspect-video"
		}
	}
});

const cardBody = cva("", {
	variants: {
		variant: {
			list: "p-4 sm:p-5 md:p-6 lg:p-7",
			grid: "flex flex-1 flex-col p-4 sm:p-5"
		}
	}
});

const cardMetaRow = cva("mb-2 flex gap-2", {
	variants: {
		variant: {
			list: "flex-col sm:flex-row sm:items-start sm:justify-between",
			grid: "flex-col"
		}
	}
});

const cardTitle = cva(
	"text-card-foreground group-hover:text-accent line-clamp-2 flex-1 leading-snug font-bold tracking-tight text-balance transition-colors",
	{
		variants: {
			variant: {
				list: "text-lg sm:text-xl md:text-2xl",
				grid: "text-lg"
			}
		}
	}
);

const cardDescription = cva("text-muted-foreground mb-4 leading-relaxed text-pretty", {
	variants: {
		variant: {
			list: "line-clamp-2 text-sm sm:text-base",
			grid: "line-clamp-3 text-sm"
		}
	}
});

const IMAGE_SIZES: Record<"list" | "grid", string> = {
	list: "(max-width: 1024px) 100vw, 768px",
	grid: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
};

const MAX_TAGS: Record<"list" | "grid", number> = {
	list: 3,
	grid: 2
};

type PostCardProps = {
	post: PostSummary;
	variant?: "list" | "grid";
	priority?: boolean;
};

export function PostCard({ post, variant = "grid", priority = false }: PostCardProps) {
	const visibleTags = post.tags.slice(0, MAX_TAGS[variant]);
	const hiddenCount = post.tags.length - visibleTags.length;

	return (
		<Link
			href={`/posts/${post.slug}`}
			className={cn(
				"group bg-card border-border-subtle overflow-hidden rounded-xl border shadow-sm transition-all duration-300",
				"hover:border-accent/30 hover:shadow-md motion-safe:hover:-translate-y-0.5",
				"focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
				variant === "grid" ? "flex h-full flex-col" : "block"
			)}
		>
			{post.thumbnail ? (
				<div className={cardImageWrapper({ variant })}>
					<Image
						src={post.thumbnail}
						alt={post.title}
						fill
						priority={priority}
						loading={priority ? "eager" : "lazy"}
						className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
						sizes={IMAGE_SIZES[variant]}
					/>
				</div>
			) : variant === "grid" ? (
				/* 썸네일 없는 grid 카드의 높이 통일용 플레이스홀더 */
				<div className={cn(cardImageWrapper({ variant }), "bg-muted")} aria-hidden />
			) : null}

			<div className={cardBody({ variant })}>
				<div className={cardMetaRow({ variant })}>
					<h3 className={cardTitle({ variant })}>{post.title}</h3>
					<time className="text-muted-foreground shrink-0 text-xs tabular-nums" dateTime={post.date}>
						{formatDate(post.date)}
					</time>
				</div>

				<p className={cardDescription({ variant })}>{post.description}</p>

				<div className={cn("flex flex-wrap items-center gap-2", variant === "grid" && "mt-auto")}>
					{visibleTags.length > 0 && (
						<div className="flex flex-1 flex-wrap items-center gap-1.5">
							{visibleTags.map((tag) => (
								<span
									key={tag}
									className="border-border-subtle text-muted-foreground hover:border-accent/50 hover:bg-accent-subtle hover:text-accent rounded border px-2 py-0.5 font-mono text-xs transition-colors"
								>
									<span aria-hidden>#</span>
									{formatLocalizedSlug(tag)}
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
