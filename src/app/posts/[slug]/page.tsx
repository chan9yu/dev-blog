import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { extractTocFromMarkdown, formatDate, getAllPosts, getPostDetail, TableOfContents } from "@/features/blog";
import { getAllSeries, SeriesNavigation } from "@/features/series";
import { MdxCode } from "@/shared/components/mdx/MdxCode";
import { createHeading } from "@/shared/components/mdx/MdxHeading";
import { MdxImage } from "@/shared/components/mdx/MdxImage";
import { MdxLink } from "@/shared/components/mdx/MdxLink";
import { MdxTable } from "@/shared/components/mdx/MdxTable";
import { baseUrl } from "@/shared/constants";

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: MdxImage,
	a: MdxLink,
	code: MdxCode,
	Table: MdxTable
};

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({
		slug: post.url_slug
	}));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPostDetail(slug);
	if (!post) {
		return;
	}

	const { title, released_at: publishedTime, short_description: description, thumbnail } = post;
	const ogImage = thumbnail ? thumbnail : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/posts/${post.url_slug}`,
			images: [
				{
					url: ogImage
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage]
		}
	};
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPostDetail(slug);

	if (!post) {
		notFound();
	}

	const tocItems = extractTocFromMarkdown(post.content);

	// 시리즈 포스트 정보 가져오기
	const allSeries = post.series && post.index !== undefined ? await getAllSeries() : [];
	const currentSeries = allSeries.find((s) => s.name === post.series);
	const seriesPosts = currentSeries?.posts || [];

	return (
		<div className="relative grid grid-cols-1 xl:grid-cols-[1fr_256px] xl:gap-16">
			<article className="pb-16">
				<script
					type="application/ld+json"
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BlogPosting",
							headline: post.title,
							datePublished: post.released_at,
							dateModified: post.updated_at,
							description: post.short_description,
							image: post.thumbnail ? `${baseUrl}${post.thumbnail}` : `/og?title=${encodeURIComponent(post.title)}`,
							url: `${baseUrl}/posts/${post.url_slug}`,
							author: {
								"@type": "Person",
								name: "My Portfolio"
							}
						})
					}}
				/>

				{/* Header */}
				<header className="mb-12 space-y-6">
					<div className="space-y-4">
						<h1
							className="title text-4xl font-bold tracking-tight sm:text-5xl"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							{post.title}
						</h1>
						<p className="text-lg leading-relaxed" style={{ color: "rgb(var(--color-text-secondary))" }}>
							{post.short_description}
						</p>
					</div>

					{/* Meta Info */}
					<div
						className="flex flex-wrap items-center gap-4 text-sm"
						style={{ color: "rgb(var(--color-text-tertiary))" }}
					>
						<time dateTime={post.released_at} className="flex items-center gap-2">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{formatDate(post.released_at)}
						</time>
						{post.updated_at !== post.released_at && (
							<span className="flex items-center gap-2">
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								업데이트: {formatDate(post.updated_at)}
							</span>
						)}
					</div>

					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:shadow-sm"
									style={{
										backgroundColor: "rgb(var(--color-bg-secondary))",
										color: "rgb(var(--color-text-secondary))",
										border: "1px solid rgb(var(--color-border-primary))"
									}}
								>
									<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										/>
									</svg>
									{tag}
								</span>
							))}
						</div>
					)}

					<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />
				</header>

				{/* Series Navigation */}
				{post.series && post.index !== undefined && seriesPosts.length > 0 && (
					<div className="mb-8">
						<SeriesNavigation seriesName={post.series} currentIndex={post.index} allPosts={seriesPosts} />
					</div>
				)}

				{/* Content */}
				<div className="prose prose-lg">
					<MDXRemote source={post.content} components={components} />
				</div>
			</article>

			{/* TOC - Desktop Only */}
			{tocItems.length > 0 && (
				<aside className="hidden xl:block">
					<div className="sticky top-24">
						<TableOfContents items={tocItems} />
					</div>
				</aside>
			)}
		</div>
	);
}
