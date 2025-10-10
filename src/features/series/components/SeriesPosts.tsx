"use client";

import { useState } from "react";

import { BlogPostCard } from "@/features/blog/components/BlogPostCard";
import { ViewToggle } from "@/features/blog/components/ViewToggle";
import type { PostSummary } from "@/features/blog/types";
import { cn } from "@/shared/utils";

type SeriesPostsProps = {
	posts: PostSummary[];
};

export function SeriesPosts({ posts }: SeriesPostsProps) {
	const [view, setView] = useState<"list" | "grid">("list");

	return (
		<div className="space-y-6">
			{/* View Toggle */}
			<div className="flex justify-end">
				<ViewToggle view={view} onViewChange={setView} />
			</div>

			{/* Posts Grid/List */}
			<div
				className={cn(view === "list" ? "flex flex-col gap-4 sm:gap-6" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}
			>
				{posts.map((post) => (
					<BlogPostCard key={post.slug} post={post} variant={view} />
				))}
			</div>
		</div>
	);
}
