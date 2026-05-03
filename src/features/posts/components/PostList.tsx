"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

// rAF로 IntersectionObserver setState를 다음 paint 사이클로 지연 — 레이아웃 스래싱 방지.
// AnimatePresence mode="popLayout": 뷰 전환 시 퇴장 카드가 레이아웃을 즉시 해제해 진입 카드 정렬 안정.
export function PostList({ posts }: PostListProps) {
	const { view } = useViewMode();
	const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | undefined>(undefined);

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
					view === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				<AnimatePresence mode="popLayout">
					{visiblePosts.map((post, index) => {
						// 첫 카드: priority + framer-motion 우회 — LCP candidate paint timing 안정화 + preload hint 일치.
						if (index === 0) {
							return <PostCard key={post.slug} post={post} variant={view} priority />;
						}
						return (
							<motion.div key={post.slug} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
								<PostCard post={post} variant={view} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
