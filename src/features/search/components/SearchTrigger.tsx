"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { Dialog } from "@/shared/components/ui/Dialog";
import type { PostSummary } from "@/shared/types";

import { useSearchShortcut } from "../hooks/useSearchShortcut";

/** 검색 결과 목록 컨테이너 — staggerChildren으로 각 항목이 순차 진입 */
const listVariants = {
	visible: { transition: { staggerChildren: 0.04 } }
};

/** 개별 결과 항목 — fade + slide-up */
const itemVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
	},
	exit: {
		opacity: 0,
		y: -4,
		transition: { duration: 0.15 }
	}
};

const MAX_RESULTS = 10;

type SearchTriggerProps = {
	posts: PostSummary[];
};

/**
 * 레거시 SearchModal 디자인 참조:
 * - 상단 정렬(top 10vh 수준), max-w-2xl, rounded-xl
 * - 헤더 border-b + Search 아이콘 + input + close
 * - 빈 상태: "검색어를 입력하세요"
 * - 결과 없음: "검색 결과가 없습니다 / 다른 검색어를 시도해보세요"
 * - Footer(빈 상태만): `ESC` kbd 안내 + 총 포스트 수
 *
 * shadcn Dialog primitive 재사용(억지 수정 금지).
 * listbox/option ARIA는 arrow key 키보드 navigate가 없으므로 제거 — 단순 링크 nav 구조로 복원(a11y-auditor 지적 반영).
 */
export function SearchTrigger({ posts }: SearchTriggerProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	useSearchShortcut(() => setOpen(true));

	const trimmed = query.trim();
	const results = useMemo(() => {
		if (!trimmed) return [];
		const q = trimmed.toLowerCase();

		return posts
			.filter(
				(post) =>
					post.title.toLowerCase().includes(q) ||
					post.description.toLowerCase().includes(q) ||
					post.tags.some((tag) => tag.toLowerCase().includes(q))
			)
			.slice(0, MAX_RESULTS);
	}, [posts, trimmed]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleSelect = () => {
		setOpen(false);
		setQuery("");
	};

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	return (
		<>
			<button
				type="button"
				onClick={handleOpen}
				aria-label="검색 열기"
				aria-keyshortcuts="Meta+k Control+k"
				className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
			>
				<Search className="size-5" aria-hidden />
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<Dialog.Content
					showCloseButton={false}
					className="top-modal max-w-2xl translate-y-0 gap-0 border-0 p-0 shadow-2xl sm:max-w-2xl"
				>
					<Dialog.Title className="sr-only">포스트 검색</Dialog.Title>
					<Dialog.Description className="sr-only">제목·설명·태그로 포스트를 검색합니다.</Dialog.Description>

					<div className="border-border-subtle flex items-center gap-3 border-b px-4 py-4">
						<Search className="text-muted-foreground size-5 shrink-0" aria-hidden />
						<input
							type="text"
							autoFocus
							placeholder="포스트 검색... (제목, 내용, 태그)"
							value={query}
							onChange={handleQueryChange}
							aria-label="검색어"
							className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none focus:placeholder:opacity-50"
						/>
						<Dialog.Close
							className="text-muted-foreground hover:text-foreground flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
							aria-label="검색 닫기"
						>
							<X className="size-4" aria-hidden />
						</Dialog.Close>
					</div>

					<div className="max-h-modal-content overflow-y-auto p-2">
						{trimmed === "" ? (
							<div className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm">
								검색어를 입력하세요
							</div>
						) : results.length === 0 ? (
							<div className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm">
								<div>
									<p className="mb-1 font-medium">검색 결과가 없습니다</p>
									<p className="text-xs">다른 검색어를 시도해보세요</p>
								</div>
							</div>
						) : (
							<AnimatePresence mode="wait">
								<motion.ul
									key={trimmed}
									className="space-y-1"
									aria-label="검색 결과"
									variants={listVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
								>
									{results.map((post) => (
										<motion.li key={post.slug} variants={itemVariants}>
											<Link
												href={`/posts/${post.slug}`}
												onClick={handleSelect}
												className="hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring block rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
											>
												<p className="text-foreground line-clamp-1 text-sm font-medium">{post.title}</p>
												<p className="text-muted-foreground line-clamp-1 text-xs">{post.description}</p>
											</Link>
										</motion.li>
									))}
								</motion.ul>
							</AnimatePresence>
						)}
					</div>

					{trimmed === "" && (
						<div className="border-border-subtle text-muted-foreground border-t px-4 py-3 text-xs">
							<div className="flex items-center justify-between">
								<span>
									<kbd className="bg-muted rounded px-2 py-1 font-mono">ESC</kbd>&nbsp;를 눌러 닫기
								</span>
								<span>총 {posts.length}개의 포스트</span>
							</div>
						</div>
					)}
				</Dialog.Content>
			</Dialog>
		</>
	);
}
