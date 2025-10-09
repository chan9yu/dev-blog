import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllTags, getPostsByTag } from "@/features/blog";
import { BlogPostCard } from "@/features/blog/components/BlogPostCard";
import { SITE } from "@/shared/config";

export async function generateStaticParams() {
	const allTags = await getAllTags();

	return allTags.map((item) => ({
		tag: item.tag
	}));
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata | undefined> {
	const { tag } = await params;
	const posts = await getPostsByTag(tag);

	if (posts.length === 0) return;

	const description = `${tag} 태그가 포함된 포스트 ${posts.length}개를 확인하세요. 관련 주제의 글을 한눈에 탐색할 수 있습니다.`;

	return {
		title: `#${tag}`,
		description,
		openGraph: {
			title: `#${tag} · chan9yu`,
			description,
			type: "website",
			url: `${SITE.url}/tags/${encodeURIComponent(tag)}`
		},
		twitter: {
			card: "summary_large_image",
			title: `#${tag} · chan9yu`,
			description
		},
		alternates: {
			canonical: `${SITE.url}/tags/${encodeURIComponent(tag)}`
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
						<svg className="text-accent h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
						<h1 className="title text-primary text-4xl font-bold tracking-tight sm:text-5xl">#{tag}</h1>
					</div>
					<p className="text-secondary text-lg">총 {posts.length}개의 글</p>
				</div>
				<hr className="border-primary" />
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
					className="bg-secondary text-primary border-primary inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
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
