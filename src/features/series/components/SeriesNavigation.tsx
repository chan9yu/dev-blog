import Link from "next/link";

import type { PostSummary } from "@/features/blog";
import { slugifyUrlSafe } from "@/shared/utils";

type SeriesNavigationProps = {
	seriesName: string;
	currentIndex: number;
	allPosts: PostSummary[];
};

export function SeriesNavigation({ seriesName, currentIndex, allPosts }: SeriesNavigationProps) {
	const seriesSlug = slugifyUrlSafe(seriesName);
	const sortedPosts = [...allPosts].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
	const currentPostIndex = sortedPosts.findIndex((p) => p.index === currentIndex);
	const prevPost = currentPostIndex > 0 ? sortedPosts[currentPostIndex - 1] : null;
	const nextPost = currentPostIndex < sortedPosts.length - 1 ? sortedPosts[currentPostIndex + 1] : null;

	return (
		<div
			className="space-y-4 rounded-xl border p-6"
			style={{
				backgroundColor: "rgb(var(--color-bg-secondary))",
				borderColor: "rgb(var(--color-border-primary))"
			}}
		>
			{/* Series Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						className="flex h-8 w-8 items-center justify-center rounded-lg"
						style={{ backgroundColor: "rgb(var(--color-bg-primary))" }}
					>
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style={{ color: "rgb(var(--color-accent))" }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<div>
						<p
							className="text-xs font-medium tracking-wider uppercase"
							style={{ color: "rgb(var(--color-text-tertiary))" }}
						>
							시리즈
						</p>
						<Link
							href={`/series/${seriesSlug}`}
							className="font-semibold transition-colors hover:text-[rgb(var(--color-accent))]"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							{seriesName}
						</Link>
					</div>
				</div>
				<span className="text-sm font-medium" style={{ color: "rgb(var(--color-text-tertiary))" }}>
					{currentIndex} / {sortedPosts.length}
				</span>
			</div>

			{/* Navigation Buttons */}
			<div className="grid grid-cols-2 gap-3">
				{prevPost ? (
					<Link
						href={`/posts/${prevPost.url_slug}`}
						className="group flex flex-col gap-1 rounded-lg border p-3 transition-all hover:shadow-sm"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-primary))"
						}}
					>
						<span
							className="flex items-center gap-1 text-xs font-medium"
							style={{ color: "rgb(var(--color-text-tertiary))" }}
						>
							<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							이전 글
						</span>
						<span
							className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-[rgb(var(--color-accent))]"
							style={{ color: "rgb(var(--color-text-secondary))" }}
						>
							{prevPost.title}
						</span>
					</Link>
				) : (
					<div
						className="flex flex-col gap-1 rounded-lg border p-3"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-primary))",
							opacity: 0.5
						}}
					>
						<span className="text-xs font-medium" style={{ color: "rgb(var(--color-text-tertiary))" }}>
							이전 글
						</span>
						<span className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
							첫 번째 글입니다
						</span>
					</div>
				)}

				{nextPost ? (
					<Link
						href={`/posts/${nextPost.url_slug}`}
						className="group flex flex-col gap-1 rounded-lg border p-3 text-right transition-all hover:shadow-sm"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-primary))"
						}}
					>
						<span
							className="flex items-center justify-end gap-1 text-xs font-medium"
							style={{ color: "rgb(var(--color-text-tertiary))" }}
						>
							다음 글
							<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</span>
						<span
							className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-[rgb(var(--color-accent))]"
							style={{ color: "rgb(var(--color-text-secondary))" }}
						>
							{nextPost.title}
						</span>
					</Link>
				) : (
					<div
						className="flex flex-col gap-1 rounded-lg border p-3 text-right"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-primary))",
							opacity: 0.5
						}}
					>
						<span className="text-xs font-medium" style={{ color: "rgb(var(--color-text-tertiary))" }}>
							다음 글
						</span>
						<span className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
							마지막 글입니다
						</span>
					</div>
				)}
			</div>

			{/* Series Link */}
			<Link
				href={`/series/${seriesSlug}`}
				className="flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all hover:shadow-sm"
				style={{
					backgroundColor: "rgb(var(--color-bg-primary))",
					borderColor: "rgb(var(--color-border-primary))",
					color: "rgb(var(--color-text-secondary))"
				}}
			>
				<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
				</svg>
				시리즈 전체 보기
			</Link>
		</div>
	);
}
