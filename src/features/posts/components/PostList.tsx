"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { ViewToggle } from "./ViewToggle";

const PAGE_SIZE = 12;

/** 포스트 카드 mount/exit/layout 애니메이션 — 기존 버전 패턴 */
const cardVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.2 }
	}
};

/** 컨테이너: staggerChildren으로 카드들이 순차적으로 진입 */
const containerVariants = {
	visible: {
		transition: { staggerChildren: 0.05 }
	}
};

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
 * ## requestAnimationFrame 전략
 * IntersectionObserver 콜백에서 직접 setState하면 레이아웃 스래싱이 발생할 수 있다.
 * rAF로 상태 업데이트를 다음 paint 사이클로 지연해 렌더링 성능을 개선한다.
 *
 * ## framer-motion AnimatePresence
 * mode="popLayout": 뷰 전환(list↔grid) 시 퇴장 카드가 레이아웃을 즉시 해제해
 * 진입 카드가 자연스럽게 자리를 잡는다.
 */
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
					// rAF로 paint 사이클에 맞춰 상태 업데이트 → 렌더링 스래싱 방지
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
				initial="hidden"
				animate="visible"
				className={cn(
					view === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				<AnimatePresence mode="popLayout">
					{visiblePosts.map((post, index) => (
						<motion.div key={post.slug} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
							<PostCard post={post} variant={view} priority={index < 2} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			{hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
		</div>
	);
}
