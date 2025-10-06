import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getAllPosts } from "@/features/blog";
import { getTagCounts, TagList } from "@/features/tags";
import { baseUrl } from "@/shared/constants";

export async function generateStaticParams() {
	const tagCounts = await getTagCounts();

	return Object.keys(tagCounts).map((tag) => ({
		tag: encodeURIComponent(tag)
	}));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
	const { tag } = await params;
	const decodedTag = decodeURIComponent(tag);
	const posts = await getAllPosts();
	const tagPosts = posts.filter((post) => post.tags.includes(decodedTag));

	if (tagPosts.length === 0) {
		return;
	}

	const description = `${decodedTag} 태그의 포스트 ${tagPosts.length}개`;

	return {
		title: `${decodedTag} 태그`,
		description,
		openGraph: {
			title: `${decodedTag} 태그`,
			description,
			type: "website",
			url: `${baseUrl}/tags/${tag}`,
			images: [
				{
					url: `${baseUrl}/og?title=${encodeURIComponent(decodedTag)}`
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title: `${decodedTag} 태그`,
			description,
			images: [`${baseUrl}/og?title=${encodeURIComponent(decodedTag)}`]
		}
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag } = await params;
	const decodedTag = decodeURIComponent(tag);
	const [posts, tagCounts] = await Promise.all([getAllPosts(), getTagCounts()]);
	const tagPosts = posts.filter((post) => post.tags.includes(decodedTag));

	if (tagPosts.length === 0) {
		notFound();
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<header className="space-y-4">
				<div className="flex items-center gap-2 text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
					<Link href="/posts" className="transition-colors hover:text-[rgb(var(--color-accent))]">
						블로그
					</Link>
					<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
					<span>태그</span>
				</div>

				<div className="flex items-center gap-3">
					<div
						className="flex h-12 w-12 items-center justify-center rounded-lg"
						style={{ backgroundColor: "rgb(var(--color-bg-secondary))" }}
					>
						<svg
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							style={{ color: "rgb(var(--color-accent))" }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
					</div>
					<div>
						<h1
							className="text-2xl font-bold tracking-tight sm:text-3xl"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							{decodedTag}
						</h1>
						<p className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
							총 {tagPosts.length}개의 포스트
						</p>
					</div>
				</div>

				<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />
			</header>

			{/* Content */}
			<div className="grid gap-8 lg:grid-cols-[220px_1fr]">
				{/* Sidebar - Tags */}
				<aside className="lg:sticky lg:top-24 lg:h-fit">
					<TagList tagCounts={tagCounts} currentTag={decodedTag} />
				</aside>

				{/* Main - Posts */}
				<main className="space-y-2 sm:space-y-3">
					{tagPosts.map((post) => (
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
				</main>
			</div>
		</div>
	);
}
