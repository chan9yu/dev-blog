"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent, MouseEvent } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useSearch } from "@/features/search/hooks";
import type { SearchablePost } from "@/features/search/types";
import SearchIcon from "@/shared/assets/icons/search.svg";
import XIcon from "@/shared/assets/icons/x.svg";
import { cn } from "@/shared/utils";

import { SearchResultItem } from "./SearchResultItem";

const FOCUS_DELAY_MS = 100;

type SearchModalProps = {
	isOpen: boolean;
	onClose: () => void;
	posts: SearchablePost[];
};

export function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { query, setQuery, results, isEmpty } = useSearch(posts, {
		limit: 10,
		threshold: 0.4
	});

	// 모달이 열릴 때 스크롤 방지 및 입력창 포커스
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			// 다음 틱에 포커스 (애니메이션 후)
			setTimeout(() => {
				inputRef.current?.focus();
			}, FOCUS_DELAY_MS);
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// ESC 키로 닫기
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	const handleContentClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();
	const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

	// Portal을 사용하여 body에 직접 렌더링
	if (typeof document === "undefined") return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-110 flex items-start justify-center px-4 pt-[10vh]">
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-label="검색"
							initial={{ opacity: 0, scale: 0.95, y: -20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{ type: "spring", damping: 30, stiffness: 300 }}
							className="bg-elevated relative w-full max-w-2xl overflow-hidden rounded-xl shadow-2xl"
							onClick={handleContentClick}
						>
							{/* 헤더 */}
							<div className="border-primary flex items-center gap-3 border-b px-4 py-4">
								<SearchIcon className="text-tertiary size-5 shrink-0" aria-hidden="true" />
								<input
									ref={inputRef}
									type="text"
									value={query}
									onChange={handleQueryChange}
									placeholder="포스트 검색... (제목, 내용, 태그)"
									className={cn(
										"text-primary placeholder:text-tertiary flex-1 bg-transparent text-base outline-none",
										"focus:placeholder:opacity-50"
									)}
								/>
								<button
									onClick={onClose}
									className="text-secondary hover:bg-secondary hover:text-primary flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
									aria-label="검색 닫기"
								>
									<XIcon className="size-4" aria-hidden="true" />
								</button>
							</div>

							{/* 검색 결과 */}
							<div className="max-h-[60vh] overflow-y-auto p-2">
								{query.trim() === "" ? (
									<div className="text-tertiary flex items-center justify-center py-12 text-center text-sm">
										검색어를 입력하세요
									</div>
								) : isEmpty ? (
									<div className="text-tertiary flex items-center justify-center py-12 text-center text-sm">
										<div>
											<p className="mb-1 font-medium">검색 결과가 없습니다</p>
											<p className="text-xs">다른 검색어를 시도해보세요</p>
										</div>
									</div>
								) : (
									<div className="space-y-1">
										{results.map((result) => (
											<SearchResultItem key={result.post.slug} result={result} onSelect={onClose} />
										))}
									</div>
								)}
							</div>

							{/* Footer - 단축키 안내 */}
							{query.trim() === "" && (
								<div className="border-primary text-tertiary border-t px-4 py-3 text-xs">
									<div className="flex items-center justify-between">
										<span>
											<kbd className="bg-secondary rounded px-2 py-1 font-mono">ESC</kbd>를 눌러 닫기
										</span>
										<span>총 {posts.length}개의 포스트</span>
									</div>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>,
		document.body
	);
}
