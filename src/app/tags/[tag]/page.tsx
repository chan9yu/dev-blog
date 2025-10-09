import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getPostsByTag } from "@/features/blog";
import { BlogPostCard } from "@/features/blog/components/BlogPostCard";
import { baseUrl } from "@/shared/constants";

export async function generateStaticParams() {
	const allTags = await getAllTags();

	return allTags.map((item) => ({
		tag: item.tag
	}));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
	const { tag } = await params;
	const posts = await getPostsByTag(tag);

	if (posts.length === 0) {
		return;
	}

	const description = `${tag} 태그 관련 글 - 총 ${posts.length}개`;

	return {
		title: `#${tag}`,
		description,
		openGraph: {
			title: `#${tag}`,
			description,
			type: "website",
			url: `${baseUrl}/tags/${encodeURIComponent(tag)}`
		},
		twitter: {
			card: "summary_large_image",
			title: `#${tag}`,
			description
		}
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag } = await params;
	const posts = await getPostsByTag(tag);

	if (posts.length === 0) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-6xl">
			{/* Header */}
			<header className="mb-12 space-y-6">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<svg
							className="h-8 w-8"
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
						<h1
							className="title text-4xl font-bold tracking-tight sm:text-5xl"
							style={{ color: "rgb(var(--color-text-primary))" }}
						>
							#{tag}
						</h1>
					</div>
					<p className="text-lg" style={{ color: "rgb(var(--color-text-secondary))" }}>
						총 {posts.length}개의 글
					</p>
				</div>
				<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />
			</header>

			{/* Posts Grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => (
					<BlogPostCard key={post.url_slug} post={post} />
				))}
			</div>

			{/* Back to All Tags */}
			<div className="mt-12 text-center">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
					style={{
						backgroundColor: "rgb(var(--color-bg-secondary))",
						color: "rgb(var(--color-text-primary))",
						border: "1px solid rgb(var(--color-border-primary))"
					}}
				>
					<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					홈으로 돌아가기
				</Link>
			</div>
		</div>
	);
}
