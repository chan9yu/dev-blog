import Link from "next/link";

import ChevronLeftIcon from "@/shared/assets/icons/chevron-left.svg";
import ChevronRightIcon from "@/shared/assets/icons/chevron-right.svg";

import type { PostSummary } from "../types";

type PostNavigationProps = {
	prevPost?: PostSummary | null;
	nextPost?: PostSummary | null;
};

export function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
	if (!prevPost && !nextPost) {
		return null;
	}

	return (
		<nav className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-2">
			{/* Previous Post */}
			{prevPost ? (
				<Link
					href={`/posts/${prevPost.slug}`}
					className="bg-secondary border-primary hover:bg-tertiary group flex min-h-[44px] flex-col gap-1.5 rounded-lg border p-4 transition-all duration-200 hover:shadow-md sm:gap-2 sm:p-6"
				>
					<div className="text-tertiary flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						<ChevronLeftIcon className="size-3.5 sm:size-4" />
						<span>이전 글</span>
					</div>
					<h3 className="text-primary group-hover-accent line-clamp-2 text-sm font-semibold transition-colors sm:text-base">
						{prevPost.title}
					</h3>
				</Link>
			) : (
				<div />
			)}

			{/* Next Post */}
			{nextPost && (
				<Link
					href={`/posts/${nextPost.slug}`}
					className="bg-secondary border-primary hover:bg-tertiary group flex min-h-[44px] flex-col gap-1.5 rounded-lg border p-4 text-right transition-all duration-200 hover:shadow-md sm:gap-2 sm:p-6"
				>
					<div className="text-tertiary flex items-center justify-end gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
						<span>다음 글</span>
						<ChevronRightIcon className="size-3.5 sm:size-4" />
					</div>
					<h3 className="text-primary group-hover-accent line-clamp-2 text-sm font-semibold transition-colors sm:text-base">
						{nextPost.title}
					</h3>
				</Link>
			)}
		</nav>
	);
}
