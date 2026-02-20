import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import {
	BlogLayout,
	extractTocFromMarkdown,
	findAdjacentPosts,
	findRelatedPostsByTags,
	formatDate,
	getAllPosts,
	getPostDetail,
	PostNavigation,
	RelatedPosts,
	sortPostsByDateDescending
} from "@/features/blog";
import { LightboxProvider } from "@/features/lightbox";
import { getAllSeries, SeriesNavigation } from "@/features/series";
import { ViewCounter } from "@/features/views";
import CalendarIcon from "@/shared/assets/icons/calendar.svg";
import EyeIcon from "@/shared/assets/icons/eye.svg";
import TagIcon from "@/shared/assets/icons/tag.svg";
import { CommentsSection, ReadingProgress, ShareButton } from "@/shared/components";
import {
	createHeading,
	MdxCode,
	MdxImage,
	MdxImg,
	MdxLink,
	MdxPre,
	MdxTable,
	MdxTbody,
	MdxTd,
	MdxTh,
	MdxThead,
	MdxTr
} from "@/shared/components/mdx";
import { SITE } from "@/shared/config";
import { slugify, type Theme } from "@/shared/utils";

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: MdxImage,
	img: MdxImg,
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

	// 이전글/다음글 찾기 (날짜 순으로 정렬 - 최신순)
	const allPosts = await getAllPosts();
	const sortedPosts = sortPostsByDateDescending(allPosts);
	const { prevPost, nextPost } = findAdjacentPosts(sortedPosts, slug);

	// 관련 포스트 찾기 (같은 태그 기반)
	const relatedPosts = findRelatedPostsByTags(allPosts, slug, post.tags);

	// 서버사이드에서 테마 쿠키 읽기 (댓글 초기 테마 설정용)
	const cookieStore = await cookies();
	const theme = (cookieStore.get("theme")?.value as Theme) || "light";

	return (
		<BlogLayout tocItems={tocItems}>
			<ReadingProgress />
			<LightboxProvider>
				<article className="min-w-0 flex-1 pb-12 sm:pb-16">
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
					<header className="mb-10 space-y-5 sm:mb-14 sm:space-y-7">
						<div className="space-y-4 sm:space-y-5">
							<h1 className="title text-primary text-2xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-3xl md:text-4xl lg:text-5xl">
								{post.title}
							</h1>
							<p className="text-secondary text-base leading-relaxed text-pretty break-keep sm:text-lg">
								{post.description}
							</p>
						</div>

						{/* Meta Info */}
						<div className="text-tertiary flex flex-wrap items-center justify-between gap-3 text-xs sm:gap-4 sm:text-sm">
							<time dateTime={post.date} className="flex items-center gap-1.5 sm:gap-2">
								<CalendarIcon className="size-3.5 sm:size-4" aria-hidden="true" />
								{formatDate(post.date)}
							</time>
							<div className="flex items-center gap-1.5 px-4 sm:gap-2">
								<EyeIcon className="size-3.5 sm:size-4" aria-hidden="true" />
								<Suspense
									fallback={
										<span className="inline-block w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700">&nbsp;</span>
									}
								>
									<ViewCounter slug={post.slug} />
								</Suspense>
							</div>
						</div>

						{/* Tags & Share */}
						<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
							{post.tags && post.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5 sm:gap-2">
									{post.tags.map((tag) => (
										<Link
											key={tag}
											href={`/tags/${slugify(tag)}`}
											className="bg-secondary text-secondary border-primary inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-sm"
										>
											<TagIcon className="size-3 sm:size-3.5" aria-hidden="true" />
											{tag}
										</Link>
									))}
								</div>
							)}

							<ShareButton title={post.title} text={post.description} url={`${SITE.url}/posts/${post.slug}`} />
						</div>

						<hr className="border-primary" />
					</header>

					{/* Series Navigation */}
					{post.series && post.seriesOrder !== undefined && post.seriesOrder !== null && seriesPosts.length > 0 && (
						<div className="mb-6 sm:mb-8">
							<SeriesNavigation seriesName={post.series} currentIndex={post.seriesOrder} allPosts={seriesPosts} />
						</div>
					)}

					{/* Thumbnail */}
					{post.thumbnail && (
						<div className="relative mb-6 aspect-[2/1] w-full overflow-hidden rounded-xl sm:mb-8 sm:rounded-2xl">
							<Image
								src={post.thumbnail}
								alt={post.title}
								fill
								priority
								className="object-cover"
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
							/>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-sm sm:prose-base md:prose-lg">
						<MDXRemote
							source={post.content}
							components={components}
							options={{
								mdxOptions: {
									remarkPlugins: [remarkGfm, remarkBreaks]
								}
							}}
						/>
					</div>

					{/* Post Navigation */}
					<PostNavigation prevPost={prevPost} nextPost={nextPost} />

					{/* Related Posts */}
					<RelatedPosts posts={relatedPosts} />

					{/* Comments */}
					<CommentsSection initialTheme={theme} />
				</article>
			</LightboxProvider>
		</BlogLayout>
	);
}
