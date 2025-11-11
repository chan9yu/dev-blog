import { BlogLayout } from "@/features/blog";

export default function Loading() {
	return (
		<BlogLayout tocItems={[]}>
			<article className="min-w-0 flex-1 pb-12 sm:pb-16">
				{/* Header Skeleton */}
				<header className="mb-10 space-y-5 sm:mb-14 sm:space-y-7">
					<div className="space-y-4 sm:space-y-5">
						{/* Title skeleton */}
						<div className="space-y-3">
							<div className="bg-tertiary h-8 w-full animate-pulse rounded sm:h-10 md:h-12 lg:h-14" />
							<div className="bg-tertiary h-8 w-3/4 animate-pulse rounded sm:h-10 md:h-12 lg:h-14" />
						</div>
						{/* Description skeleton */}
						<div className="space-y-2">
							<div className="bg-tertiary h-5 w-full animate-pulse rounded sm:h-6" />
							<div className="bg-tertiary h-5 w-5/6 animate-pulse rounded sm:h-6" />
						</div>
					</div>

					{/* Meta Info Skeleton */}
					<div className="flex flex-wrap items-center gap-3 sm:gap-4">
						<div className="bg-tertiary h-4 w-32 animate-pulse rounded sm:h-5 sm:w-40" />
					</div>

					{/* Tags & Share Skeleton */}
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
						<div className="flex flex-wrap gap-1.5 sm:gap-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="bg-tertiary h-10 w-20 animate-pulse rounded-lg sm:h-8" />
							))}
						</div>
						<div className="bg-tertiary h-10 w-24 animate-pulse rounded-lg sm:h-8" />
					</div>

					<hr className="border-primary" />
				</header>

				{/* Thumbnail Skeleton */}
				<div className="bg-tertiary relative mb-6 aspect-[2/1] w-full animate-pulse overflow-hidden rounded-xl sm:mb-8 sm:rounded-2xl" />

				{/* Content Skeleton */}
				<div className="prose prose-sm sm:prose-base md:prose-lg">
					<div className="space-y-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="space-y-3">
								{i % 3 === 0 && <div className="bg-tertiary h-7 w-2/3 animate-pulse rounded sm:h-8 md:h-9" />}
								<div className="space-y-2">
									<div className="bg-tertiary h-4 w-full animate-pulse rounded sm:h-5" />
									<div className="bg-tertiary h-4 w-full animate-pulse rounded sm:h-5" />
									<div className="bg-tertiary h-4 w-5/6 animate-pulse rounded sm:h-5" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Post Navigation Skeleton */}
				<div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6">
					<div className="bg-tertiary h-24 animate-pulse rounded-lg sm:h-28" />
					<div className="bg-tertiary h-24 animate-pulse rounded-lg sm:h-28" />
				</div>

				{/* Related Posts Skeleton */}
				<section className="mt-12 sm:mt-16">
					<div className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3">
						<span className="bg-accent h-6 w-1 rounded-full sm:h-7" />
						<div className="bg-tertiary h-6 w-48 animate-pulse rounded sm:h-7 sm:w-56" />
					</div>
					<div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="bg-tertiary h-96 animate-pulse rounded-xl" />
						))}
					</div>
				</section>
			</article>
		</BlogLayout>
	);
}
