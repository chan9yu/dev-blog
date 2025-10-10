import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { extractTocFromMarkdown, formatDate, getAllPosts, getPostDetail, TableOfContents } from "@/features/blog";
import { getAllSeries, SeriesNavigation } from "@/features/series";
import { CommentsSection, ReadingProgress } from "@/shared/components";
import { MdxCode } from "@/shared/components/mdx/MdxCode";
import { createHeading } from "@/shared/components/mdx/MdxHeading";
import { MdxImage } from "@/shared/components/mdx/MdxImage";
import { MdxLink } from "@/shared/components/mdx/MdxLink";
import { MdxPre } from "@/shared/components/mdx/MdxPre";
import { MdxTable, MdxTbody, MdxTd, MdxTh, MdxThead, MdxTr } from "@/shared/components/mdx/MdxTable";
import { SITE } from "@/shared/config";
import { utterancesRepo } from "@/shared/constants";
import type { Theme } from "@/shared/utils";

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: MdxImage,
	a: MdxLink,
	pre: MdxPre,
	code: MdxCode,
	table: MdxTable,
	thead: MdxThead,
	tbody: MdxTbody,
	tr: MdxTr,
	th: MdxTh,
	td: MdxTd
};

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({
		slug: post.slug
	}));
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
	const { slug } = await params;

	const post = await getPostDetail(slug);
	if (!post) return;

	const IS_PROD = process.env.VERCEL_ENV === "production";

	const { title, date: publishedTime, description, thumbnail, slug: postSlug, tags, private: isPrivate } = post;

	const canonical = `${SITE.url}/posts/${postSlug}`;
	const ogImage = thumbnail || `${SITE.url}/og?title=${encodeURIComponent(title)}`;

	const allowIndex =
		IS_PROD &&
		!isPrivate &&
		((): boolean => {
			if (!publishedTime) return true;
			const ts = Date.parse(publishedTime);
			return Number.isFinite(ts) ? ts <= Date.now() : true;
		})();

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			title,
			description,
			type: "article",
			url: canonical,
			siteName: SITE.name,
			locale: SITE.locale,
			publishedTime,
			tags,
			images: [{ url: ogImage, width: 1200, height: 630, alt: title, type: "image/png" }],
			authors: [SITE.author.name]
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
			creator: SITE.social.twitter ?? undefined
		},
		robots: {
			index: allowIndex,
			follow: true,
			googleBot: {
				index: allowIndex,
				follow: true,
				"max-image-preview": "large",
				"max-video-preview": -1,
				"max-snippet": -1
			}
		},
		authors: [{ name: SITE.author.name, url: SITE.author.url }]
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
	const allSeries =
		post.series && post.seriesOrder !== undefined && post.seriesOrder !== null ? await getAllSeries() : [];
	const currentSeries = allSeries.find((s) => s.name === post.series);
	const seriesPosts = currentSeries?.posts || [];

	// 서버사이드에서 테마 쿠키 읽기 (댓글 초기 테마 설정용)
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";
	const utterancesTheme = theme === "dark" ? "github-dark" : "github-light";

	return (
		<div className="relative flex xl:gap-16">
			<ReadingProgress />
			<article className="min-w-0 flex-1 pb-16">
				<script
					type="application/ld+json"
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BlogPosting",
							headline: post.title,
							datePublished: post.date,
							description: post.description,
							image: post.thumbnail
								? `${SITE.url}${post.thumbnail}`
								: `${SITE.url}/og?title=${encodeURIComponent(post.title)}`,
							url: `${SITE.url}/posts/${post.slug}`,
							author: {
								"@type": "Person",
								name: SITE.author.name,
								url: SITE.author.url
							},
							publisher: {
								"@type": "Person",
								name: SITE.author.name
							},
							keywords: post.tags,
							inLanguage: SITE.language
						})
					}}
				/>

				{/* Header */}
				<header className="mb-12 space-y-6">
					<div className="space-y-4">
						<h1 className="title text-primary text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
						<p className="text-secondary text-lg leading-relaxed">{post.description}</p>
					</div>

					{/* Meta Info */}
					<div className="text-tertiary flex flex-wrap items-center gap-4 text-sm">
						<time dateTime={post.date} className="flex items-center gap-2">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{formatDate(post.date)}
						</time>
					</div>

					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<Link
									key={tag}
									href={`/tags/${encodeURIComponent(tag)}`}
									className="bg-secondary text-secondary border-primary inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:shadow-sm"
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
								</Link>
							))}
						</div>
					)}

					<hr className="border-primary" />
				</header>

				{/* Series Navigation */}
				{post.series && post.seriesOrder !== undefined && post.seriesOrder !== null && seriesPosts.length > 0 && (
					<div className="mb-8">
						<SeriesNavigation seriesName={post.series} currentIndex={post.seriesOrder} allPosts={seriesPosts} />
					</div>
				)}

				{/* Thumbnail */}
				{post.thumbnail && (
					<div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-2xl">
						<Image
							src={post.thumbnail}
							alt={post.title}
							fill
							priority
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
						/>
					</div>
				)}

				{/* Content */}
				<div className="prose prose-lg">
					<MDXRemote
						source={post.content}
						components={components}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkGfm]
							}
						}}
					/>
				</div>

				{/* Comments */}
				<CommentsSection repo={utterancesRepo} initialTheme={utterancesTheme} />
			</article>

			{/* TOC - Desktop Only */}
			{tocItems.length > 0 && (
				<aside className="hidden w-3xs flex-none xl:block">
					<div className="sticky top-24">
						<TableOfContents items={tocItems} />
					</div>
				</aside>
			)}
		</div>
	);
}
