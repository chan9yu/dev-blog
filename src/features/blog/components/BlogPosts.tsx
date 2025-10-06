import Link from "next/link";

import { getAllPosts } from "@/features/blog/services";
import { formatDate } from "@/features/blog/utils";

export async function BlogPosts() {
	const allBlogs = await getAllPosts();

	return (
		<div>
			{allBlogs
				.sort((a, b) => {
					if (new Date(a.released_at) > new Date(b.released_at)) {
						return -1;
					}
					return 1;
				})
				.map((post) => (
					<Link key={post.url_slug} className="mb-4 flex flex-col space-y-1" href={`/blog/${post.url_slug}`}>
						<div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
							<p className="w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400">
								{formatDate(post.released_at, false)}
							</p>
							<p className="tracking-tight text-neutral-900 dark:text-neutral-100">{post.title}</p>
						</div>
					</Link>
				))}
		</div>
	);
}
