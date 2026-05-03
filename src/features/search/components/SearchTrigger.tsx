"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { PostSummary } from "@/shared/types";

import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { SearchButton } from "./SearchButton";

// fuse.js·framer-motion 의존성을 ⌘K/버튼 인터랙션까지 지연 로드 — 초기 First Load JS에서 제외.
const SearchModal = dynamic(() => import("./SearchModal").then((mod) => ({ default: mod.SearchModal })), {
	ssr: false
});

type SearchTriggerProps = {
	posts: PostSummary[];
};

export function SearchTrigger({ posts }: SearchTriggerProps) {
	const [open, setOpen] = useState(false);

	useSearchShortcut(() => setOpen(true));

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<>
			<SearchButton onClick={handleOpen} />
			{open && <SearchModal open={open} onOpenChange={setOpen} posts={posts} />}
		</>
	);
}
