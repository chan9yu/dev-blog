type PostListSkeletonProps = {
	count?: number;
};

export function PostListSkeleton({ count = 6 }: PostListSkeletonProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy role="status" aria-label="포스트 불러오는 중">
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className="bg-card border-border overflow-hidden rounded-xl border">
					<div className="bg-muted aspect-video w-full animate-pulse" />
					<div className="space-y-3 p-5">
						<div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
						<div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
						<div className="space-y-2">
							<div className="bg-muted h-3 w-full animate-pulse rounded" />
							<div className="bg-muted h-3 w-5/6 animate-pulse rounded" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
