import type { PostSummary } from "../types";
import { BlogPostCard } from "./BlogPostCard";

type FilteredBlogPostsProps = {
	posts: PostSummary[];
	selectedTag?: string;
};

export function FilteredBlogPosts({ posts, selectedTag }: FilteredBlogPostsProps) {
	const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;

	const sortedPosts = filteredPosts.sort((a, b) => {
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
