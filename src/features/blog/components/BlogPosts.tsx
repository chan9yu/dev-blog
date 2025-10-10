import { getAllPosts } from "@/features/blog/services";

import { BlogPostCard } from "./BlogPostCard";

export async function BlogPosts() {
	const allBlogs = await getAllPosts();

	const sortedPosts = allBlogs.sort((a, b) => {
		if (new Date(a.date) > new Date(b.date)) {
			return -1;
		}
		return 1;
	});

	return (
		<div className="flex flex-col gap-4 sm:gap-6">
			{sortedPosts.map((post) => (
				<BlogPostCard key={post.slug} post={post} />
			))}
		</div>
	);
}
