"use client";

import { LayoutGrid, List } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { PostCard } from "./PostCard";

const PAGE_SIZE = 12;
const VIEW_STORAGE_KEY = "blog:posts:view";
const VIEW_CHANGE_EVENT = "blog:posts:view:change";

type ViewMode = "list" | "grid";

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
	return stored === "grid" ? "grid" : "list";
}

function getViewServerSnapshot(): ViewMode {
	return "list";
}

type PostListProps = {
	posts: PostSummary[];
};

/**
 * 레거시 FilteredBlogPosts 디자인:
 * - 상단 우측 뷰 토글(List/Grid, default list)
 * - list: flex flex-col gap-4 sm:gap-6
 * - grid: grid gap-6 sm:grid-cols-2 lg:grid-cols-3
 * - IntersectionObserver 무한 스크롤 (PAGE_SIZE 12)
 *
 * 태그 필터는 URL 쿼리 기반(상위 RSC에서 처리), 이 컴포넌트는 뷰 토글만 담당.
 */
export function PostList({ posts }: PostListProps) {
	const view = useSyncExternalStore(subscribeView, getViewSnapshot, getViewServerSnapshot);
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const visiblePosts = posts.slice(0, displayCount);
	const hasMore = visiblePosts.length < posts.length;

	const handleSetView = (next: ViewMode) => {
		window.localStorage.setItem(VIEW_STORAGE_KEY, next);
		window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
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

	if (posts.length === 0) {
		return (
			<p className="text-muted-foreground py-16 text-center text-sm" role="status">
				조건에 맞는 포스트가 없습니다.
			</p>
		);
	}

	const toggleButtonClass = (isActive: boolean) =>
		cn(
			"group focus-visible:ring-ring flex size-9 cursor-pointer items-center justify-center rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
			isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
		);

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<div
					className="bg-muted/50 hidden items-center gap-1 rounded-lg p-1 backdrop-blur-sm sm:flex"
					role="group"
					aria-label="뷰 모드"
				>
					<button
						type="button"
						onClick={() => handleSetView("list")}
						aria-label="리스트 보기"
						aria-pressed={view === "list"}
						className={toggleButtonClass(view === "list")}
					>
						<List className="size-4 transition-transform group-hover:scale-110" aria-hidden />
					</button>
					<button
						type="button"
						onClick={() => handleSetView("grid")}
						aria-label="격자 보기"
						aria-pressed={view === "grid"}
						className={toggleButtonClass(view === "grid")}
					>
						<LayoutGrid className="size-4 transition-transform group-hover:scale-110" aria-hidden />
					</button>
				</div>
			</div>

			<div
				className={cn(
					view === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				{visiblePosts.map((post, index) => (
					<PostCard key={post.slug} post={post} variant={view} priority={index < 2} />
				))}
			</div>

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
