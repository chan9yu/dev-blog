"use client";

import Link from "next/link";

import type { SearchResult } from "@/features/search/types";
import { cn } from "@/shared/utils";

type SearchResultItemProps = {
	result: SearchResult;
	onSelect: () => void;
};

export function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
	const { post } = result;

	return (
		<Link
			href={`/posts/${post.slug}`}
			onClick={onSelect}
			className={cn(
				"block rounded-lg p-4 transition-colors",
				"hover:bg-secondary focus:bg-secondary focus:outline-none"
			)}
		>
			<div className="space-y-1">
				{/* 제목 */}
				<h3 className="text-primary line-clamp-1 text-base font-semibold">{post.title}</h3>

				{/* 설명 */}
				<p className="text-secondary line-clamp-2 text-sm">{post.description}</p>

				{/* 날짜 및 태그 */}
				<div className="flex items-center gap-2 text-xs">
					<time className="text-tertiary" dateTime={post.date}>
						{new Date(post.date).toLocaleDateString("ko-KR", {
							year: "numeric",
							month: "long",
							day: "numeric"
						})}
					</time>

					{post.tags.length > 0 && (
						<>
							<span className="text-tertiary">·</span>
							<div className="flex flex-wrap gap-1">
								{post.tags.slice(0, 3).map((tag) => (
									<span key={tag} className="text-tertiary rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
										#{tag}
									</span>
								))}
								{post.tags.length > 3 && <span className="text-tertiary">+{post.tags.length - 3}</span>}
							</div>
						</>
					)}
				</div>
			</div>
		</Link>
	);
}
