import Link from "next/link";

import { getAllPosts } from "@/features/blog/services";
import { formatDate } from "@/features/blog/utils";

export async function BlogPosts() {
	const allBlogs = await getAllPosts();

	return (
		<div className="space-y-2 sm:space-y-3">
			{allBlogs
				.sort((a, b) => {
					if (new Date(a.released_at) > new Date(b.released_at)) {
						return -1;
					}
					return 1;
				})
				.map((post) => (
					<Link
						key={post.url_slug}
						href={`/posts/${post.url_slug}`}
						className="group block rounded-lg border px-4 py-4 transition-all hover:shadow-md sm:rounded-xl sm:px-6 sm:py-5"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-secondary))"
						}}
					>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
							<div className="flex-1 space-y-1.5 sm:space-y-2">
								<h3
									className="text-base font-semibold tracking-tight transition-colors group-hover:text-[rgb(var(--color-accent))] sm:text-lg"
									style={{ color: "rgb(var(--color-text-primary))" }}
								>
									{post.title}
								</h3>
								<p
									className="line-clamp-2 text-sm leading-relaxed"
									style={{ color: "rgb(var(--color-text-secondary))" }}
								>
									{post.short_description}
								</p>
								{post.tags && post.tags.length > 0 && (
									<div className="flex flex-wrap gap-1.5 sm:gap-2">
										{post.tags.slice(0, 3).map((tag) => (
											<span
												key={tag}
												className="rounded px-2 py-0.5 text-xs font-medium"
												style={{
													backgroundColor: "rgb(var(--color-bg-tertiary))",
													color: "rgb(var(--color-text-tertiary))"
												}}
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
							<time
								className="text-xs tabular-nums sm:mt-1 sm:text-sm"
								dateTime={post.released_at}
								style={{ color: "rgb(var(--color-text-tertiary))" }}
							>
								{formatDate(post.released_at, false)}
							</time>
						</div>
					</Link>
				))}
		</div>
	);
}
