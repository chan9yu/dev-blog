"use client";

import { useState } from "react";

import type { PostSummary } from "@/shared/types";

import { useSearchShortcut } from "../hooks/useSearchShortcut";
import { SearchButton } from "./SearchButton";
import { SearchModal } from "./SearchModal";

type SearchTriggerProps = {
	posts: PostSummary[];
};

/**
 * Header에서 사용하는 검색 진입점 — 버튼 + 모달 + ⌘K 단축키 조립.
 *
 * 본 컴포넌트는 상태(open)와 단축키만 책임진다. 실제 UI는 `SearchButton`·`SearchModal`에 위임.
 * 다른 레이아웃에서 모달만 쓰고 싶으면 `SearchModal`을 직접 사용하면 된다 (PRD §7.4).
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
			<SearchModal open={open} onOpenChange={setOpen} posts={posts} />
		</>
	);
}
