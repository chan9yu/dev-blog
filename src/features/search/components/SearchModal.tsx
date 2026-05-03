"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { Dialog } from "@/shared/components/ui/Dialog";
import type { PostSummary } from "@/shared/types";
import { EASE_OUT } from "@/shared/utils/motion";

import { useSearch } from "../hooks/useSearch";
import { SearchResultItem } from "./SearchResultItem";
import { SearchSuggestions } from "./SearchSuggestions";

const listVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.04 } }
};

const itemVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: EASE_OUT }
	},
	exit: {
		opacity: 0,
		y: -4,
		transition: { duration: 0.15 }
	}
};

type SearchModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	posts: PostSummary[];
};

/**
 * 포스트 검색 모달 — Fuse.js 인덱스 기반 fuzzy 검색 + 하이라이트 + 키보드 내비.
 *
 * 접근성:
 * - ESC, 바깥 클릭: Radix Dialog가 자동 처리
 * - ArrowDown: 입력창 → 첫 링크로 포커스 이동, 이후 링크 간 순환
 * - ArrowUp: 역방향 순환
 * - 결과 클릭/선택 시 모달 닫힘 + 쿼리 초기화
 */
export function SearchModal({ open, onOpenChange, posts }: SearchModalProps) {
	const { query, debouncedQuery, setQuery, results } = useSearch({ posts });

	// 분기 기준은 debouncedQuery.trim()로 통일 — results와 동일 소스.
	// query.trim()을 쓰면 공백 입력 시 "검색 결과 없음"이 깜빡 뜨는 회귀.
	const trimmed = debouncedQuery.trim();
	const hasPendingInput = query.trim() !== "" && trimmed === "";

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const handleSelect = () => {
		onOpenChange(false);
		setQuery("");
	};

	const handleContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

		// 추천 영역(빈 검색)·결과 영역 모두 동일한 a[href] 셀렉터로 순회 — Dialog.Content 전체 스캔.
		const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]"));
		if (links.length === 0) return;

		const activeIndex = links.findIndex((link) => link === document.activeElement);
		const lastIndex = links.length - 1;

		// 입력창(리스트 외부)에서 ArrowUp을 누른 경우 — 리스트 끝으로 점프하는 것은 비직관적.
		// 포커스를 그대로 두어 기본 동작 허용.
		if (event.key === "ArrowUp" && activeIndex < 0) return;

		event.preventDefault();
		let nextIndex: number;
		if (event.key === "ArrowDown") {
			nextIndex = activeIndex < 0 || activeIndex >= lastIndex ? 0 : activeIndex + 1;
		} else {
			nextIndex = activeIndex <= 0 ? lastIndex : activeIndex - 1;
		}

		links[nextIndex]?.focus();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Dialog.Content
				showCloseButton={false}
				onKeyDown={handleContentKeyDown}
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
						hasPendingInput ? (
							<div
								className="text-muted-foreground flex items-center justify-center py-12 text-center text-sm"
								aria-live="polite"
							>
								검색 중...
							</div>
						) : (
							<SearchSuggestions posts={posts} onSelect={handleSelect} />
						)
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
								{results.map((result) => (
									<motion.li key={result.post.slug} variants={itemVariants}>
										<SearchResultItem result={result} onSelect={handleSelect} />
									</motion.li>
								))}
							</motion.ul>
						</AnimatePresence>
					)}
				</div>

				{query.trim() === "" && (
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
	);
}
