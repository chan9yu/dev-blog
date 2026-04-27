"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { PostSummary } from "@/shared/types";

import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { SearchButton } from "./SearchButton";

/**
 * SearchModal은 첫 진입 시 필요 없으므로 초기 번들에서 분리.
 * fuse.js·framer-motion 등 무거운 의존성을 사용자가 ⌘K 또는 버튼을 누르기 전까지 지연 로드 → INP 개선.
 */
const SearchModal = dynamic(() => import("./SearchModal").then((mod) => ({ default: mod.SearchModal })), {
	ssr: false
});

type SearchTriggerProps = {
	posts: PostSummary[];
};

/**
 * Header에서 사용하는 검색 진입점 — 버튼 + 모달 + ⌘K 단축키 조립.
 *
 * 본 컴포넌트는 상태(open)와 단축키만 책임진다. 실제 UI는 `SearchButton`·`SearchModal`에 위임.
 * `SearchModal`은 `next/dynamic`으로 lazy load — 초기 First Load JS에서 제외 (M6-10).
 */
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
