"use client";

import { useState } from "react";

import { useSearchShortcut } from "@/features/search/hooks";
import type { SearchablePost } from "@/features/search/types";
import SearchIcon from "@/shared/assets/icons/search.svg";
import { cn } from "@/shared/utils";

import { SearchModal } from "./SearchModal";

type SearchButtonProps = {
	posts: SearchablePost[];
	className?: string;
};

export function SearchButton({ posts, className }: SearchButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	// Cmd/Ctrl + K 단축키로 검색 모달 열기
	useSearchShortcut(handleOpen);

	return (
		<>
			<button
				onClick={handleOpen}
				className={cn(
					"flex min-h-11 min-w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-70",
					className
				)}
				aria-label="검색"
				aria-expanded={isOpen}
				title="검색 (⌘K)"
			>
				<SearchIcon className="size-5" aria-hidden="true" />
			</button>

			<SearchModal isOpen={isOpen} onClose={handleClose} posts={posts} />
		</>
	);
}
