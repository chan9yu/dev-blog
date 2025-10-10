import Link from "next/link";

import BookOpenIcon from "@/assets/icons/book-open.svg";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import ListIcon from "@/assets/icons/list.svg";
import type { PostSummary } from "@/features/blog";
import { slugifyUrlSafe } from "@/shared/utils";

type SeriesNavigationProps = {
	seriesName: string;
	currentIndex: number;
	allPosts: PostSummary[];
};

export function SeriesNavigation({ seriesName, currentIndex, allPosts }: SeriesNavigationProps) {
	const seriesSlug = slugifyUrlSafe(seriesName);
	const sortedPosts = [...allPosts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
	const currentPostIndex = sortedPosts.findIndex((p) => p.seriesOrder === currentIndex);
	const prevPost = currentPostIndex > 0 ? sortedPosts[currentPostIndex - 1] : null;
	const nextPost = currentPostIndex < sortedPosts.length - 1 ? sortedPosts[currentPostIndex + 1] : null;

	return (
		<div className="bg-secondary border-primary space-y-4 rounded-xl border p-6">
			{/* Series Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
						<BookOpenIcon className="text-accent size-4" />
					</div>
					<div>
						<p className="text-tertiary text-xs font-medium tracking-wider uppercase">시리즈</p>
						<Link
							href={`/series/${seriesSlug}`}
							className="text-primary font-semibold transition-colors hover:text-[rgb(var(--color-accent))]"
						>
							{seriesName}
						</Link>
					</div>
				</div>
				<span className="text-tertiary text-sm font-medium">
					{currentIndex} / {sortedPosts.length}
				</span>
			</div>

			{/* Navigation Buttons */}
			<div className="flex gap-3">
				{prevPost ? (
					<Link
						href={`/posts/${prevPost.slug}`}
						className="bg-primary border-primary group flex flex-1 flex-col gap-1 rounded-lg border p-3 transition-all hover:shadow-sm"
					>
						<span className="text-tertiary flex items-center gap-1 text-xs font-medium">
							<ChevronLeftIcon className="size-3" />
							이전 글
						</span>
						<span className="text-secondary line-clamp-1 text-sm font-medium transition-colors group-hover:text-[rgb(var(--color-accent))]">
							{prevPost.title}
						</span>
					</Link>
				) : (
					<div className="bg-primary border-primary flex flex-1 flex-col gap-1 rounded-lg border p-3 opacity-50">
						<span className="text-tertiary text-xs font-medium">이전 글</span>
						<span className="text-tertiary text-sm">첫 번째 글입니다</span>
					</div>
				)}

				{nextPost ? (
					<Link
						href={`/posts/${nextPost.slug}`}
						className="bg-primary border-primary group flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right transition-all hover:shadow-sm"
					>
						<span className="text-tertiary flex items-center justify-end gap-1 text-xs font-medium">
							다음 글
							<ChevronRightIcon className="size-3" />
						</span>
						<span className="text-secondary line-clamp-1 text-sm font-medium transition-colors group-hover:text-[rgb(var(--color-accent))]">
							{nextPost.title}
						</span>
					</Link>
				) : (
					<div className="bg-primary border-primary flex flex-1 flex-col gap-1 rounded-lg border p-3 text-right opacity-50">
						<span className="text-tertiary text-xs font-medium">다음 글</span>
						<span className="text-tertiary text-sm">마지막 글입니다</span>
					</div>
				)}
			</div>

			{/* Series Link */}
			<Link
				href={`/series/${seriesSlug}`}
				className="bg-primary border-primary text-secondary flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all hover:shadow-sm"
			>
				<ListIcon className="size-4" />
				시리즈 전체 보기
			</Link>
		</div>
	);
}
