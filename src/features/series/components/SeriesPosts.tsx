"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { BlogPostCard } from "@/features/blog/components/BlogPostCard";
import { ViewToggle } from "@/features/blog/components/ViewToggle";
import type { PostSummary } from "@/features/blog/types";
import { cn } from "@/shared/utils";

type SeriesPostsProps = {
	posts: PostSummary[];
	defaultView?: "list" | "grid";
};

export function SeriesPosts({ posts, defaultView = "grid" }: SeriesPostsProps) {
	const [view, setView] = useState<"list" | "grid">(defaultView);

	return (
		<div className="space-y-6">
			{/* View Toggle */}
			<div className="flex justify-end">
				<ViewToggle view={view} onViewChange={setView} />
			</div>

			{/* Posts Grid/List */}
			<motion.div
				layout
				className={cn(view === "list" ? "flex flex-col gap-4 sm:gap-6" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}
			>
				<AnimatePresence mode="popLayout">
					{posts.map((post) => (
						<motion.div
							key={post.slug}
							layout
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{
								duration: 0.3,
								ease: [0.4, 0, 0.2, 1]
							}}
						>
							<BlogPostCard post={post} variant={view} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
