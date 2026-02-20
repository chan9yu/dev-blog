import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllTags, getPostsByTag } from "@/features/blog";
import { FilteredBlogPosts } from "@/features/blog";
import TagIcon from "@/shared/assets/icons/tag.svg";
import { SITE } from "@/shared/config";
import { slugify } from "@/shared/utils";

export async function generateStaticParams() {
	const allTags = await getAllTags();

	return allTags.map((item) => ({
		tag: slugify(item.tag)
	}));
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata | undefined> {
	const { tag: encodedTag } = await params;
	// URL 디코딩 (한글 처리)
	const tagSlug = decodeURIComponent(encodedTag);
	const posts = await getPostsByTag(tagSlug);

	if (posts.length === 0) return;

	// 원본 태그명 추출 (첫 번째 포스트의 태그에서)
	const originalTag = posts[0]?.tags.find((tag) => slugify(tag) === tagSlug) || tagSlug;
	const description = `${originalTag} 태그가 포함된 포스트 ${posts.length}개를 확인하세요. 관련 주제의 글을 한눈에 탐색할 수 있습니다.`;

	return {
		title: `#${originalTag}`,
		description,
		openGraph: {
			title: `#${originalTag} · chan9yu`,
			description,
			type: "website",
			url: `${SITE.url}/tags/${tagSlug}`,
			images: [
				{
					url: SITE.defaultOG,
					width: 1200,
					height: 630,
					alt: `#${originalTag} · chan9yu`
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title: `#${originalTag} · chan9yu`,
			description,
			images: [SITE.defaultOG]
		},
		alternates: {
			canonical: `${SITE.url}/tags/${tagSlug}`
		}
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag: encodedTag } = await params;
	// URL 디코딩 (한글 처리)
	const tagSlug = decodeURIComponent(encodedTag);
	const posts = await getPostsByTag(tagSlug);

	if (posts.length === 0) {
		notFound();
	}

	// 원본 태그명 추출 (첫 번째 포스트의 태그에서)
	const originalTag = posts[0]?.tags.find((tag) => slugify(tag) === tagSlug) || tagSlug;

	return (
		<div className="mx-auto max-w-6xl">
			{/* Header */}
			<header className="mb-12 space-y-6">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<TagIcon className="text-accent size-8" aria-hidden="true" />
						<h1 className="title text-primary text-4xl font-bold tracking-tight sm:text-5xl">#{originalTag}</h1>
					</div>
					<p className="text-secondary text-lg">총 {posts.length}개의 글</p>
				</div>
				<hr className="border-primary" />
			</header>

			{/* Posts with View Toggle */}
			<FilteredBlogPosts posts={posts} defaultView="grid" />
		</div>
	);
}
