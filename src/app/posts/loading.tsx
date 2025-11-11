import { BlogPostCardSkeleton } from "@/features/blog";

export default function Loading() {
	return (
		<div className="space-y-10">
			<header className="space-y-4">
				<div className="bg-tertiary h-8 w-32 animate-pulse rounded sm:h-10 sm:w-40" />
				<div className="bg-tertiary h-5 w-64 animate-pulse rounded sm:h-6 sm:w-80" />
			</header>

			<div className="flex gap-8">
				{/* Tag List Skeleton */}
				<aside className="hidden lg:block lg:w-[220px]">
					<div className="space-y-3">
						<div className="bg-tertiary h-5 w-20 animate-pulse rounded" />
						<div className="space-y-2">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-tertiary h-8 w-full animate-pulse rounded" />
							))}
						</div>
					</div>
				</aside>

				{/* Posts Grid Skeleton */}
				<main className="min-w-0 flex-1">
					<div className="space-y-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<BlogPostCardSkeleton key={i} variant="list" />
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
