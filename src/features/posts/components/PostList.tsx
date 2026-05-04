"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useHydrated } from "@/shared/hooks/useHydrated";
import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { EASE_OUT } from "@/shared/utils/motion";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { ViewToggle } from "./ViewToggle";

const PAGE_SIZE = 12;

const cardVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, ease: EASE_OUT }
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.2 }
	}
};

const containerVariants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.05 }
	}
};

type PostListProps = {
	posts: PostSummary[];
};

// hydrated gate — useViewMode server="list" vs client=localStorage 미스매치(React #418) 차단.
export function PostList({ posts }: PostListProps) {
	const { view } = useViewMode();
	const hydrated = useHydrated();
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | undefined>(undefined);

	const effectiveView = hydrated ? view : "list";
	const visiblePosts = posts.slice(0, displayCount);
	const hasMore = visiblePosts.length < posts.length;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					if (rafRef.current !== undefined) {
						cancelAnimationFrame(rafRef.current);
					}
					rafRef.current = requestAnimationFrame(() => {
						setDisplayCount((prev) => prev + PAGE_SIZE);
						rafRef.current = undefined;
					});
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
			if (rafRef.current !== undefined) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [hasMore]);

	if (posts.length === 0) {
		return (
			<p className="text-muted-foreground py-16 text-center text-sm" role="status">
				조건에 맞는 포스트가 없습니다.
			</p>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<ViewToggle />
			</div>

			{/* layout prop: 뷰 전환 시 flex↔grid 위치 변화를 framer-motion이 FLIP으로 보간 */}
			<motion.div
				layout
				variants={containerVariants}
				initial={false}
				animate="visible"
				className={cn(
					effectiveView === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				<AnimatePresence mode="popLayout">
					{visiblePosts.map((post, index) => {
						// 첫 카드: framer-motion 우회로 paint timing만 안정화 — priority preload는 view-mode 전환 시 sizes 불일치로 unused 워닝 발생하므로 제거.
						if (index === 0) {
							return <PostCard key={post.slug} post={post} variant={effectiveView} />;
						}
						return (
							<motion.div key={post.slug} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
								<PostCard post={post} variant={effectiveView} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
