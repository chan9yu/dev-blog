import { BookOpen, Calendar } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicPosts } from "@/features/posts";
import { getAllSeries, getSeriesDetail } from "@/features/series";
import { Container } from "@/shared/components/layouts/Container";
import { getSiteUrl } from "@/shared/config/site";
import { buildBreadcrumbJsonLd, buildMetadata, JsonLdScript, NOT_FOUND_METADATA } from "@/shared/seo";
import { formatDate } from "@/shared/utils/formatDate";

type SeriesDetailPageProps = {
	params: Promise<{ slug: string }>;
};

// generateMetadata + Page가 동일 렌더 트리에서 lookup 공유 (generateStaticParams는 별도 트리).
const findSeriesBySlug = cache((slug: string) => getSeriesDetail(getPublicPosts(), slug));

export async function generateStaticParams() {
	return getAllSeries(getPublicPosts()).map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) return NOT_FOUND_METADATA;

	return buildMetadata({
		title: series.name,
		description: `${series.name} 시리즈 — 총 ${series.posts.length}개의 연재 글로 구성되어 있습니다.`,
		path: `/series/${encodeURIComponent(series.slug)}`
	});
}

// series slug는 한글 허용이라 normalizeSlug 대신 직접 lookup — generateStaticParams 외 경로는 Next.js SSG가 404 처리.
export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const series = findSeriesBySlug(decodeURIComponent(slug));
	if (!series) notFound();

	const breadcrumbLd = buildBreadcrumbJsonLd({
		siteUrl: getSiteUrl(),
		items: [
			{ name: "홈", path: "/" },
			{ name: "시리즈", path: "/series" },
			{ name: series.name, path: `/series/${encodeURIComponent(series.slug)}` }
		]
	});

	return (
		<>
			<JsonLdScript id="series-breadcrumb-json-ld" data={breadcrumbLd} />
			<Container>
				<div className="py-8 lg:py-10">
					<header className="mb-12 space-y-6">
						<div className="space-y-4">
							<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance break-keep sm:text-4xl md:text-5xl">
								{series.name}
							</h1>
							<div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
								<span className="inline-flex items-center gap-2">
									<BookOpen className="size-4" aria-hidden />총 {series.posts.length}개의 글
								</span>
							</div>
						</div>
						<hr className="border-border" />
					</header>

					<ol className="space-y-4" aria-label="시리즈 포스트">
						{series.posts.map((post) => (
							<li key={post.slug} className="flex gap-4">
								<span
									className="bg-muted text-muted-foreground mt-3 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
									aria-hidden
								>
									{post.seriesOrder ?? "—"}
								</span>
								<Link
									href={`/posts/${post.slug}`}
									className="group bg-card border-border-subtle focus-visible:ring-ring block flex-1 rounded-xl border p-5 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<h2 className="text-card-foreground group-hover:text-accent line-clamp-2 text-base leading-snug font-semibold transition-colors sm:text-lg">
										{post.title}
									</h2>
									<p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">{post.description}</p>
									<time
										className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs tabular-nums"
										dateTime={post.date}
									>
										<Calendar className="size-3.5" aria-hidden />
										{formatDate(post.date)}
									</time>
								</Link>
							</li>
						))}
					</ol>
				</div>
			</Container>
		</>
	);
}
