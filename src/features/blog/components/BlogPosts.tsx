"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { PostSummary } from "@/features/blog/types";
import { cn } from "@/shared/utils";

import { BlogPostCard } from "./BlogPostCard";
import { ViewToggle } from "./ViewToggle";

type BlogPostsProps = {
	posts: PostSummary[];
};

export function BlogPosts({ posts }: BlogPostsProps) {
	const [view, setView] = useState<"list" | "grid">("list");

	const sortedPosts = posts.sort((a, b) => {
		if (new Date(a.date) > new Date(b.date)) {
			return -1;
		}
		return 1;
	});

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* View Toggle */}
			<div className="flex justify-end">
				<ViewToggle view={view} onViewChange={setView} />
			</div>

			{/* Posts Grid/List */}
			<motion.div
				layout
				className={cn(
					view === "list"
						? "flex flex-col gap-3 sm:gap-4 md:gap-6"
						: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
				)}
			>
				<AnimatePresence mode="popLayout">
					{sortedPosts.map((post) => (
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
