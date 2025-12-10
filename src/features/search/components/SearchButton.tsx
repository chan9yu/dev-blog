"use client";

import { useState } from "react";

import SearchIcon from "@/shared/assets/icons/search.svg";
import { cn } from "@/shared/utils";

import { useSearchShortcut } from "../hooks";
import type { SearchablePost } from "../types";
import { SearchModal } from "./SearchModal";

type SearchButtonProps = {
	posts: SearchablePost[];
	className?: string;
};

export function SearchButton({ posts, className }: SearchButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Cmd/Ctrl + K 단축키로 검색 모달 열기
	useSearchShortcut(() => setIsOpen(true));

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className={cn(
					"text-secondary hover:bg-secondary hover:text-primary flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg transition-colors",
					className
				)}
				aria-label="검색"
				title="검색 (⌘K)"
			>
				<SearchIcon className="size-5" />
			</button>

			<SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} posts={posts} />
		</>
	);
}
