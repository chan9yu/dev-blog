"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { PostSummary } from "@/shared/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/Dialog";

import { useSearchShortcut } from "../hooks/useSearchShortcut";

const POPULAR_TAGS = ["react", "nextjs", "typescript"];
const MAX_RESULTS = 10;

type SearchTriggerProps = {
	posts: PostSummary[];
};

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
				<DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 p-0 sm:max-w-xl">
					<DialogTitle className="sr-only">포스트 검색</DialogTitle>
					<DialogDescription className="sr-only">제목·설명·태그로 포스트를 검색합니다.</DialogDescription>
					<div className="border-border-subtle flex items-center gap-3 border-b px-4 py-3">
						<Search className="text-muted-foreground size-5 shrink-0" aria-hidden />
						<input
							type="search"
							autoFocus
							placeholder="포스트 검색..."
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							aria-label="검색어"
							className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
						/>
					</div>
					<div className="max-h-[50vh] overflow-y-auto p-2">
						{trimmed === "" ? (
							<EmptyState description="키워드를 입력하면 포스트를 찾아드립니다." />
						) : results.length === 0 ? (
							<EmptyState description={`"${trimmed}" 에 해당하는 포스트가 없습니다.`} showPopular />
						) : (
							<ul className="space-y-1" role="listbox" aria-label="검색 결과">
								{results.map((post) => (
									<li key={post.slug}>
										<Link
											href={`/posts/${post.slug}`}
											onClick={() => {
												setOpen(false);
												setQuery("");
											}}
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
				</DialogContent>
			</Dialog>
		</>
	);
}

function EmptyState({ description, showPopular = true }: { description: string; showPopular?: boolean }) {
	return (
		<div className="space-y-3 p-6 text-center">
			<p className="text-muted-foreground text-sm">{description}</p>
			{showPopular && (
				<>
					<p className="text-muted-foreground text-xs">인기 태그로 둘러보기</p>
					<div className="flex flex-wrap justify-center gap-2">
						{POPULAR_TAGS.map((tag) => (
							<Link
								key={tag}
								href={`/tags/${tag}`}
								className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors"
							>
								<span aria-hidden>#</span>
								{tag}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	);
}
