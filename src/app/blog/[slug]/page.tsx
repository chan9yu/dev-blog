import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { formatDate, getAllPosts, getPostDetail } from "@/features/blog";
import { baseUrl } from "@/shared/constants";

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
			url: `${baseUrl}/blog/${post.url_slug}`,
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

	return (
		<section>
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
						url: `${baseUrl}/blog/${post.url_slug}`,
						author: {
							"@type": "Person",
							name: "My Portfolio"
						}
					})
				}}
			/>
			<h1 className="title text-2xl font-semibold tracking-tighter">{post.title}</h1>
			<div className="mt-2 mb-8 flex items-center justify-between text-sm">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(post.released_at)}</p>
			</div>
			<article className="prose">
				<MDXRemote source={post.content} />
			</article>
		</section>
	);
}
