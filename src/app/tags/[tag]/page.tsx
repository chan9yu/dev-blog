import { Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getPublicPosts, PostList, PostListSkeleton } from "@/features/posts";
import { getAllTags, getPostsByTag } from "@/features/tags";
import { Container } from "@/shared/components/layouts/Container";
import { getSiteUrl } from "@/shared/config/site";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLdScript, NOT_FOUND_METADATA } from "@/shared/seo";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";
import { resolvePostThumbnails } from "@/shared/utils/resolveThumbnail";

type TagDetailPageProps = {
	params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
	return getAllTags(getPublicPosts()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagDetailPageProps) {
	const { tag } = await params;
	const decoded = decodeURIComponent(tag);
	if (!decoded) return NOT_FOUND_METADATA;

	const matched = getPostsByTag(getPublicPosts(), decoded);
	if (matched.length === 0) return NOT_FOUND_METADATA;

	const display = formatLocalizedSlug(decoded);
	return buildMetadata({
		title: `#${display}`,
		description: `${display} 태그가 포함된 포스트를 확인하세요. 관련 주제의 글을 한눈에 탐색할 수 있습니다.`,
		path: `/tags/${encodeURIComponent(decoded)}`
	});
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
	const { tag } = await params;

	const decoded = decodeURIComponent(tag);
	if (!decoded) notFound();

	const filtered = resolvePostThumbnails(getPostsByTag(getPublicPosts(), decoded));
	if (filtered.length === 0) {
		notFound();
	}

	const display = formatLocalizedSlug(decoded);
	const breadcrumbLd = buildBreadcrumbJsonLd({
		siteUrl: getSiteUrl(),
		items: [
			{ name: "홈", path: "/" },
			{ name: "태그", path: "/tags" },
			{ name: `#${display}`, path: `/tags/${encodeURIComponent(decoded)}` }
		]
	});

	return (
		<>
			<JsonLdScript id="tag-breadcrumb-json-ld" data={breadcrumbLd} />
			<Container>
				<div className="py-8 lg:py-10">
					<header className="mb-12 space-y-6">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Tag className="text-accent size-8" aria-hidden />
								<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-4xl md:text-5xl">
									#{display}
								</h1>
							</div>
							<p className="text-muted-foreground text-base sm:text-lg">총 {filtered.length}개의 글</p>
						</div>
						<hr className="border-border" />
					</header>

					<Suspense fallback={<PostListSkeleton count={3} />}>
						<PostList posts={filtered} />
					</Suspense>
				</div>
			</Container>
		</>
	);
}
