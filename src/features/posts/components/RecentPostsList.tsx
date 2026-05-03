"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";
import { EASE_OUT } from "@/shared/utils/motion";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { ViewToggle } from "./ViewToggle";

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
	// hidden 상태를 명시해야 자식 variants 상속이 보장됨
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.05 }
	}
};

type RecentPostsListProps = {
	posts: PostSummary[];
};

export function RecentPostsList({ posts }: RecentPostsListProps) {
	const { view } = useViewMode();

	return (
		<div className="space-y-4 sm:space-y-5">
			{/* 뷰 전환 시 스크린리더에 상태 변경 알림 (WCAG 4.1.3) */}
			<span role="status" aria-live="polite" className="sr-only">
				{view === "list" ? "리스트 보기로 전환됨" : "격자 보기로 전환됨"}
			</span>
			<div className="flex justify-end">
				<ViewToggle />
			</div>
			{/* layout prop은 자식 카드에만 — 컨테이너에 걸면 grid↔list 전환 시 CLS 유발 */}
			<motion.div
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
					{posts.map((post, index) => {
						// 홈에서 RecentPostsList는 hero 섹션 아래라 첫 카드가 below-the-fold.
						// priority preload는 unused로 보고되므로 적용하지 않고, framer-motion 우회로 paint timing 안정화만 유지.
						// dev/prod 모두 "preloaded but not used" 워닝을 차단한다.
						if (index === 0) {
							return <PostCard key={post.slug} post={post} variant={view} />;
						}
						return (
							<motion.div key={post.slug} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
								<PostCard post={post} variant={view} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
