type BlogPostCardSkeletonProps = {
	variant?: "list" | "grid";
};

export function BlogPostCardSkeleton({ variant = "list" }: BlogPostCardSkeletonProps) {
	return (
		<div className="bg-elevated border-primary block animate-pulse overflow-hidden rounded-xl border shadow-sm">
			{/* Thumbnail Skeleton */}
			<div className="bg-tertiary relative aspect-[2/1] w-full" />

			<div className="p-4 sm:p-5 md:p-6 lg:p-7">
				{variant === "list" ? (
					<>
						{/* List Layout */}
						<div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
							{/* Title skeleton */}
							<div className="flex-1 space-y-2">
								<div className="bg-tertiary h-5 w-3/4 rounded sm:h-6" />
								<div className="bg-tertiary h-5 w-1/2 rounded sm:h-6" />
							</div>
							{/* Date skeleton */}
							<div className="bg-tertiary h-4 w-20 shrink-0 rounded sm:h-5" />
						</div>

						{/* Description skeleton */}
						<div className="mb-3 space-y-2 sm:mb-4">
							<div className="bg-tertiary h-4 w-full rounded" />
							<div className="bg-tertiary h-4 w-5/6 rounded" />
						</div>

						{/* Footer: Tags + Reading Time */}
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							{/* Tags skeleton */}
							<div className="flex flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
								<div className="bg-tertiary h-6 w-16 rounded" />
								<div className="bg-tertiary h-6 w-20 rounded" />
								<div className="bg-tertiary h-6 w-14 rounded" />
							</div>
							{/* Reading time skeleton */}
							<div className="bg-tertiary h-4 w-12 shrink-0 rounded" />
						</div>
					</>
				) : (
					<>
						{/* Grid Layout */}
						<div className="mb-2 space-y-1.5 sm:mb-3 sm:space-y-2">
							{/* Title skeleton */}
							<div className="space-y-1.5">
								<div className="bg-tertiary h-5 w-full rounded sm:h-6" />
								<div className="bg-tertiary h-5 w-3/4 rounded sm:h-6" />
							</div>
							{/* Date skeleton */}
							<div className="bg-tertiary h-3 w-20 rounded" />
						</div>

						{/* Description skeleton */}
						<div className="mb-3 space-y-1.5 sm:mb-4">
							<div className="bg-tertiary h-3 w-full rounded sm:h-4" />
							<div className="bg-tertiary h-3 w-full rounded sm:h-4" />
							<div className="bg-tertiary h-3 w-2/3 rounded sm:h-4" />
						</div>

						{/* Footer: Tags + Reading Time */}
						<div className="space-y-2 sm:space-y-3">
							{/* Tags skeleton */}
							<div className="flex min-w-0 items-center gap-1.5 overflow-hidden sm:gap-2">
								<div className="bg-tertiary h-5 w-16 rounded" />
								<div className="bg-tertiary h-5 w-20 rounded" />
							</div>
							{/* Reading time skeleton */}
							<div className="bg-tertiary h-4 w-12 rounded" />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
