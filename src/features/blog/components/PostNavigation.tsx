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
		<nav className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
			{/* Previous Post */}
			{prevPost ? (
				<Link
					href={`/posts/${prevPost.slug}`}
					className="bg-secondary border-primary hover:bg-tertiary group flex flex-col gap-2 rounded-lg border p-6 transition-all duration-200 hover:shadow-md"
				>
					<div className="text-tertiary flex items-center gap-2 text-sm font-medium">
						<ChevronLeftIcon className="size-4" />
						<span>이전 글</span>
					</div>
					<h3 className="text-primary line-clamp-2 font-semibold transition-colors group-hover:text-[rgb(var(--color-accent))]">
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
					className="bg-secondary border-primary hover:bg-tertiary group flex flex-col gap-2 rounded-lg border p-6 text-right transition-all duration-200 hover:shadow-md"
				>
					<div className="text-tertiary flex items-center justify-end gap-2 text-sm font-medium">
						<span>다음 글</span>
						<ChevronRightIcon className="size-4" />
					</div>
					<h3 className="text-primary line-clamp-2 font-semibold transition-colors group-hover:text-[rgb(var(--color-accent))]">
						{nextPost.title}
					</h3>
				</Link>
			)}
		</nav>
	);
}
