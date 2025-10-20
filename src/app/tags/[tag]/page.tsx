import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllTags, getPostsByTag } from "@/features/blog";
import { FilteredBlogPosts } from "@/features/blog/components/FilteredBlogPosts";
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
	const tag = decodeURIComponent(encodedTag);
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
			url: `${SITE.url}/tags/${slugify(tag)}`
		},
		twitter: {
			card: "summary_large_image",
			title: `#${tag} · chan9yu`,
			description
		},
		alternates: {
			canonical: `${SITE.url}/tags/${slugify(tag)}`
		}
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag: encodedTag } = await params;
	const tag = decodeURIComponent(encodedTag);
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
						<TagIcon className="text-accent size-8" />
						<h1 className="title text-primary text-4xl font-bold tracking-tight sm:text-5xl">#{tag}</h1>
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
