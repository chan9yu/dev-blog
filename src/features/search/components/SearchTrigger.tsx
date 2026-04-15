"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { PostSummary } from "@/shared/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";

import { useSearchShortcut } from "../hooks/useSearchShortcut";

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
 */
export function SearchTrigger({ posts }: SearchTriggerProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	useSearchShortcut(() => setOpen(true));

	const trimmed = query.trim();
	const results = trimmed
		? posts
				.filter((post) => {
					const q = trimmed.toLowerCase();
					return (
						post.title.toLowerCase().includes(q) ||
						post.description.toLowerCase().includes(q) ||
						post.tags.some((tag) => tag.toLowerCase().includes(q))
					);
				})
				.slice(0, MAX_RESULTS)
		: [];

	const handleSelect = () => {
		setOpen(false);
		setQuery("");
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="검색 열기 (Cmd+K)"
				className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<Search className="size-5" aria-hidden />
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="top-[10vh] max-w-2xl translate-y-0 gap-0 p-0 sm:max-w-2xl">
					<DialogTitle className="sr-only">포스트 검색</DialogTitle>
					<DialogDescription className="sr-only">제목·설명·태그로 포스트를 검색합니다.</DialogDescription>

					<div className="border-border-subtle flex items-center gap-3 border-b px-4 py-4">
						<Search className="text-muted-foreground size-5 shrink-0" aria-hidden />
						<input
							type="search"
							autoFocus
							placeholder="포스트 검색... (제목, 내용, 태그)"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							aria-label="검색어"
							className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none focus:placeholder:opacity-50"
						/>
					</div>

					<div className="max-h-[60vh] overflow-y-auto p-2">
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
							<ul className="space-y-1" role="listbox" aria-label="검색 결과">
								{results.map((post) => (
									<li key={post.slug}>
										<Link
											href={`/posts/${post.slug}`}
											onClick={handleSelect}
											role="option"
											className="hover:bg-muted focus-visible:bg-muted block rounded-md px-3 py-2 focus-visible:outline-none"
										>
											<p className="text-foreground line-clamp-1 text-sm font-medium">{post.title}</p>
											<p className="text-muted-foreground line-clamp-1 text-xs">{post.description}</p>
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>

					{trimmed === "" && (
						<div className="border-border-subtle text-muted-foreground border-t px-4 py-3 text-xs">
							<div className="flex items-center justify-between">
								<span>
									<kbd className="bg-muted rounded px-2 py-1 font-mono">ESC</kbd>를 눌러 닫기
								</span>
								<span>총 {posts.length}개의 포스트</span>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
