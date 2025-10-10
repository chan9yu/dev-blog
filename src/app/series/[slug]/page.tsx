import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/features/blog";
import { getAllSeries, getSeriesDetail } from "@/features/series";
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
	const series = await getSeriesDetail(slug);

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
			url: `${SITE.url}/series/${slug}`
		},
		twitter: {
			card: "summary_large_image",
			title: `${name} · chan9yu`,
			description
		},
		alternates: {
			canonical: `${SITE.url}/series/${slug}`
		}
	};
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const series = await getSeriesDetail(slug);

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
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							총 {series.posts.length}개의 글
						</div>
						<div className="flex items-center gap-2">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							시리즈
						</div>
					</div>
				</div>
				<hr className="border-primary" />
			</header>

			<div className="space-y-4">
				{series.posts.map((post) => (
					<Link
						key={post.slug}
						href={`/posts/${post.slug}`}
						className="bg-elevated border-primary group block rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					>
						<div className="flex items-start gap-4">
							<div className="bg-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white">
								{post.seriesOrder}
							</div>

							<div className="flex-1 space-y-2">
								<h2 className="text-primary group-hover-accent text-xl font-bold transition-colors">{post.title}</h2>
								<p className="text-secondary line-clamp-2 text-sm leading-relaxed">{post.description}</p>
								<div className="text-muted flex items-center gap-4 text-xs">
									<time dateTime={post.date}>{formatDate(post.date, false)}</time>
									{post.tags && post.tags.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{post.tags.slice(0, 3).map((tag) => (
												<span key={tag} className="bg-tertiary text-tertiary rounded px-2 py-0.5">
													{tag}
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
