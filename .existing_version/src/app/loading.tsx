import { BlogPostCardSkeleton } from "@/features/blog";

export default function Loading() {
	return (
		<div className="flex flex-col gap-10 lg:flex-row">
			{/* Main Content */}
			<div className="min-w-0 flex-1 space-y-10 sm:space-y-14">
				{/* Hero Section Skeleton */}
				<section className="space-y-4 sm:space-y-6">
					<div className="space-y-3 sm:space-y-4">
						{/* Title skeleton */}
						<div className="space-y-2">
							<div className="bg-tertiary h-8 w-48 animate-pulse rounded sm:h-10 sm:w-64 md:h-12 md:w-80" />
							<div className="bg-tertiary h-8 w-64 animate-pulse rounded sm:h-10 sm:w-80 md:h-12 md:w-96" />
						</div>
						{/* Description skeleton */}
						<div className="max-w-2xl space-y-3 sm:space-y-4">
							<div className="space-y-2">
								<div className="bg-tertiary h-5 w-full animate-pulse rounded sm:h-6" />
								<div className="bg-tertiary h-5 w-3/4 animate-pulse rounded sm:h-6" />
							</div>
							<div className="space-y-2">
								<div className="bg-tertiary h-5 w-full animate-pulse rounded sm:h-6" />
								<div className="bg-tertiary h-5 w-5/6 animate-pulse rounded sm:h-6" />
							</div>
						</div>
					</div>

					{/* Social Links Skeleton */}
					<div className="flex flex-wrap gap-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="bg-tertiary h-10 w-24 animate-pulse rounded-lg" />
						))}
					</div>
				</section>

				{/* Recent Posts Section Skeleton */}
				<section className="space-y-4 sm:space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 sm:gap-3">
							<div className="bg-accent h-6 w-1 rounded-full sm:h-7" />
							<div className="bg-tertiary h-6 w-32 animate-pulse rounded sm:h-7 sm:w-40" />
						</div>
						<div className="bg-tertiary h-4 w-20 animate-pulse rounded" />
					</div>
					<div className="space-y-4 sm:space-y-5 lg:space-y-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<BlogPostCardSkeleton key={i} variant="list" />
						))}
					</div>
				</section>
			</div>

			{/* Sidebar Skeleton - Hidden on mobile/tablet */}
			<aside className="hidden w-64 lg:block">
				<div className="sticky top-24 space-y-6">
					{/* Popular Posts Skeleton */}
					<section className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="bg-accent size-1.5 rounded-full" />
							<div className="bg-tertiary h-4 w-28 animate-pulse rounded" />
						</div>
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="bg-tertiary h-12 w-full animate-pulse rounded" />
							))}
						</div>
					</section>

					<hr className="border-primary" />

					{/* Popular Series Skeleton */}
					<section className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="bg-accent size-1.5 rounded-full" />
							<div className="bg-tertiary h-4 w-28 animate-pulse rounded" />
						</div>
						<div className="space-y-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="bg-tertiary h-16 w-full animate-pulse rounded" />
							))}
						</div>
					</section>

					<hr className="border-primary" />

					{/* Popular Tags Skeleton */}
					<section className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="bg-accent size-1.5 rounded-full" />
							<div className="bg-tertiary h-4 w-28 animate-pulse rounded" />
						</div>
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-tertiary h-7 w-16 animate-pulse rounded" />
							))}
						</div>
					</section>
				</div>
			</aside>
		</div>
	);
}
