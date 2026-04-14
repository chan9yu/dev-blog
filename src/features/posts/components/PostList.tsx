"use client";

import { LayoutGrid, List } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { PostSummary, TagCount } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { PostCard } from "./PostCard";

const PAGE_SIZE = 12;
const VIEW_STORAGE_KEY = "blog:posts:view";
const VIEW_CHANGE_EVENT = "blog:posts:view:change";

type ViewMode = "grid" | "list";

function subscribeView(callback: () => void) {
	window.addEventListener(VIEW_CHANGE_EVENT, callback);
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener(VIEW_CHANGE_EVENT, callback);
		window.removeEventListener("storage", callback);
	};
}

function getViewSnapshot(): ViewMode {
	const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
	return stored === "list" ? "list" : "grid";
}

function getViewServerSnapshot(): ViewMode {
	return "grid";
}

type PostListProps = {
	posts: PostSummary[];
	tags: TagCount[];
};

export function PostList({ posts, tags }: PostListProps) {
	const view = useSyncExternalStore(subscribeView, getViewSnapshot, getViewServerSnapshot);
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const filteredPosts = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;
	const visiblePosts = filteredPosts.slice(0, displayCount);
	const hasMore = visiblePosts.length < filteredPosts.length;

	const handleSetView = (next: ViewMode) => {
		window.localStorage.setItem(VIEW_STORAGE_KEY, next);
		window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
	};

	const handleToggleTag = (tag: string | null) => {
		setActiveTag(tag);
		setDisplayCount(PAGE_SIZE);
	};

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setDisplayCount((prev) => prev + PAGE_SIZE);
				}
			},
			{ rootMargin: "200px" }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMore]);

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
					<button
						type="button"
						onClick={() => handleToggleTag(null)}
						aria-pressed={activeTag === null}
						className={cn(
							"focus-visible:ring-ring rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
							activeTag === null
								? "bg-accent text-accent-foreground"
								: "bg-muted text-muted-foreground hover:bg-accent/10"
						)}
					>
						전체 ({posts.length})
					</button>
					{tags.slice(0, 10).map((tag) => (
						<button
							key={tag.slug}
							type="button"
							onClick={() => handleToggleTag(tag.tag)}
							aria-pressed={activeTag === tag.tag}
							className={cn(
								"focus-visible:ring-ring rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
								activeTag === tag.tag
									? "bg-accent text-accent-foreground"
									: "bg-muted text-muted-foreground hover:bg-accent/10"
							)}
						>
							{tag.tag} ({tag.count})
						</button>
					))}
				</div>
				<div
					className="border-border inline-flex shrink-0 gap-1 rounded-md border p-1"
					role="group"
					aria-label="뷰 모드"
				>
					<button
						type="button"
						onClick={() => handleSetView("grid")}
						aria-label="그리드 뷰"
						aria-pressed={view === "grid"}
						className={cn(
							"focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
							view === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
						)}
					>
						<LayoutGrid className="size-4" aria-hidden />
					</button>
					<button
						type="button"
						onClick={() => handleSetView("list")}
						aria-label="리스트 뷰"
						aria-pressed={view === "list"}
						className={cn(
							"focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
							view === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
						)}
					>
						<List className="size-4" aria-hidden />
					</button>
				</div>
			</div>

			{visiblePosts.length === 0 ? (
				<p className="text-muted-foreground py-16 text-center text-sm" role="status">
					조건에 맞는 포스트가 없습니다.
				</p>
			) : (
				<>
					<div className={cn("grid gap-6", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
						{visiblePosts.map((post) => (
							<PostCard key={post.slug} post={post} variant={view} />
						))}
					</div>
					{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
				</>
			)}
		</div>
	);
}
