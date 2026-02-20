import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllSeries, getSeriesDetail } from "@/features/series";
import { SeriesPosts } from "@/features/series";
import BookOpenIcon from "@/shared/assets/icons/book-open.svg";
import { SITE } from "@/shared/config";

export async function generateStaticParams() {
	const allSeries = await getAllSeries();

	return allSeries.map((series) => ({
		slug: series.slug
	}));
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
	const { slug } = await params;
	// URL 디코딩 (한글 slug 처리)
	const decodedSlug = decodeURIComponent(slug);
	const series = await getSeriesDetail(decodedSlug);

	if (!series) return;

	const { name, posts } = series;
	const description = `${name} 시리즈 - 총 ${posts.length}개의 연재 글로 구성되어 있습니다`;

	return {
		title: name,
		description,
		openGraph: {
			title: `${name} · chan9yu`,
			description,
			type: "website",
			url: `${SITE.url}/series/${slug}`,
			images: [
				{
					url: SITE.defaultOG,
					width: 1200,
					height: 630,
					alt: `${name} · chan9yu`
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title: `${name} · chan9yu`,
			description,
			images: [SITE.defaultOG]
		},
		alternates: {
			canonical: `${SITE.url}/series/${slug}`
		}
	};
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	// URL 디코딩 (한글 slug 처리)
	const decodedSlug = decodeURIComponent(slug);
	const series = await getSeriesDetail(decodedSlug);

	if (!series) {
		notFound();
	}

	return (
		<div className="mx-auto">
			<header className="mb-12 space-y-6">
				<div className="space-y-4">
					<h1 className="title text-primary text-4xl font-bold tracking-tight sm:text-5xl">{series.name}</h1>
					<div className="text-tertiary flex flex-wrap items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<BookOpenIcon className="size-4" aria-hidden="true" />총 {series.posts.length}개의 글
						</div>
						<div className="flex items-center gap-2">
							<BookOpenIcon className="size-4" aria-hidden="true" />
							시리즈
						</div>
					</div>
				</div>
				<hr className="border-primary" />
			</header>

			<SeriesPosts posts={series.posts} />
		</div>
	);
}
