"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { PostSummary } from "@/features/blog/types";
import { cn } from "@/shared/utils";

import { BlogPostCard } from "./BlogPostCard";
import { ViewToggle } from "./ViewToggle";

type FilteredBlogPostsProps = {
	posts: PostSummary[];
	selectedTag?: string;
	defaultView?: "list" | "grid";
};

export function FilteredBlogPosts({ posts, selectedTag, defaultView = "list" }: FilteredBlogPostsProps) {
	const [view, setView] = useState<"list" | "grid">(defaultView);

	const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;

	const sortedPosts = filteredPosts.sort((a, b) => {
		if (new Date(a.date) > new Date(b.date)) {
			return -1;
		}
		return 1;
	});

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
					{sortedPosts.map((post, index) => (
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
							<BlogPostCard post={post} variant={view} priority={index === 0} />
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
