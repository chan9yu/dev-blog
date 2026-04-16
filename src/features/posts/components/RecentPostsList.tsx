"use client";

import { AnimatePresence, motion } from "framer-motion";

import type { PostSummary } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { useViewMode } from "../hooks/useViewMode";
import { PostCard } from "./PostCard";
import { ViewToggle } from "./ViewToggle";

// framer-motion ease 배열: tuple 타입을 모듈 상수로 분리해 inline `as` 단언 제거
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

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
				initial="hidden"
				animate="visible"
				className={cn(
					view === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				<AnimatePresence mode="popLayout">
					{posts.map((post, index) => (
						<motion.div key={post.slug} layout variants={cardVariants} initial="hidden" animate="visible" exit="exit">
							<PostCard post={post} variant={view} priority={index < 2} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
