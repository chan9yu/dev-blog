import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/features/blog";
import { getAllSeries, getSeriesDetail } from "@/features/series";
import { SITE } from "@/shared/config";

export async function generateStaticParams() {
	const allSeries = await getAllSeries();

	return allSeries.map((series) => ({
		slug: series.url_slug
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
					<h1
						className="title text-4xl font-bold tracking-tight sm:text-5xl"
						style={{ color: "rgb(var(--color-text-primary))" }}
					>
						{series.name}
					</h1>
					<div
						className="flex flex-wrap items-center gap-4 text-sm"
						style={{ color: "rgb(var(--color-text-tertiary))" }}
					>
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
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							최근 업데이트: {formatDate(series.updated_at)}
						</div>
					</div>
				</div>
				<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />
			</header>

			<div className="space-y-4">
				{series.posts.map((post) => (
					<Link
						key={post.url_slug}
						href={`/posts/${post.url_slug}`}
						className="group block rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
						style={{
							backgroundColor: "rgb(var(--color-bg-elevated))",
							borderColor: "rgb(var(--color-border-primary))",
							boxShadow: "var(--shadow-sm)"
						}}
					>
						<div className="flex items-start gap-4">
							<div
								className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold"
								style={{
									backgroundColor: "rgb(var(--color-accent))",
									color: "rgb(var(--color-bg-primary))"
								}}
							>
								{post.index}
							</div>

							<div className="flex-1 space-y-2">
								<h2
									className="text-xl font-bold transition-colors group-hover:text-[rgb(var(--color-accent))]"
									style={{ color: "rgb(var(--color-text-primary))" }}
								>
									{post.title}
								</h2>
								<p
									className="line-clamp-2 text-sm leading-relaxed"
									style={{ color: "rgb(var(--color-text-secondary))" }}
								>
									{post.short_description}
								</p>
								<div className="flex items-center gap-4 text-xs" style={{ color: "rgb(var(--color-text-muted))" }}>
									<time dateTime={post.released_at}>{formatDate(post.released_at, false)}</time>
									{post.tags && post.tags.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{post.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="rounded px-2 py-0.5"
													style={{
														backgroundColor: "rgb(var(--color-bg-tertiary))",
														color: "rgb(var(--color-text-tertiary))"
													}}
												>
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
