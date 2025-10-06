import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/features/blog";
import { getAllSeries, getSeriesDetail } from "@/features/series";
import { baseUrl } from "@/shared/constants";

export async function generateStaticParams() {
	const series = await getAllSeries();

	return series.map((s) => ({
		slug: s.url_slug
	}));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const series = await getSeriesDetail(slug);

	if (!series) {
		return;
	}

	const description = `${series.name} 시리즈 - 총 ${series.posts.length}개의 포스트`;

	return {
		title: series.name,
		description,
		openGraph: {
			title: series.name,
			description,
			type: "article",
			url: `${baseUrl}/series/${series.url_slug}`,
			images: [
				{
					url: `${baseUrl}/og?title=${encodeURIComponent(series.name)}`
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title: series.name,
			description,
			images: [`${baseUrl}/og?title=${encodeURIComponent(series.name)}`]
		}
	};
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const series = await getSeriesDetail(slug);

	if (!series) {
		notFound();
	}

	return (
		<div className="space-y-12">
			{/* Header */}
			<header className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-center gap-2 text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
						<Link href="/series" className="transition-colors hover:text-[rgb(var(--color-accent))]">
							시리즈
						</Link>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
						<span>{series.name}</span>
					</div>

					<h1
						className="title text-3xl font-bold tracking-tight sm:text-4xl"
						style={{ color: "rgb(var(--color-text-primary))" }}
					>
						{series.name}
					</h1>

					<div className="flex items-center gap-4 text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
						<div className="flex items-center gap-2">
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							<span>총 {series.posts.length}개의 포스트</span>
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
							<span>마지막 업데이트: {formatDate(series.updated_at)}</span>
						</div>
					</div>
				</div>

				<hr style={{ borderColor: "rgb(var(--color-border-primary))" }} />
			</header>

			{/* Posts List */}
			<div className="space-y-4">
				{series.posts.map((post, index) => (
					<Link
						key={post.url_slug}
						href={`/posts/${post.url_slug}`}
						className="group flex gap-6 rounded-xl border p-6 transition-all hover:shadow-md"
						style={{
							backgroundColor: "rgb(var(--color-bg-primary))",
							borderColor: "rgb(var(--color-border-primary))"
						}}
					>
						{/* Index Badge */}
						<div
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold"
							style={{
								backgroundColor: "rgb(var(--color-bg-secondary))",
								color: "rgb(var(--color-accent))"
							}}
						>
							{index + 1}
						</div>

						{/* Post Info */}
						<div className="flex-1 space-y-3">
							<div className="space-y-2">
								<h2
									className="text-xl font-bold tracking-tight transition-colors group-hover:text-[rgb(var(--color-accent))]"
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
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<time className="text-sm" style={{ color: "rgb(var(--color-text-tertiary))" }}>
									{formatDate(post.released_at)}
								</time>
								{post.tags.length > 0 && (
									<>
										<span style={{ color: "rgb(var(--color-text-tertiary))" }}>•</span>
										<div className="flex flex-wrap gap-2">
											{post.tags.map((tag) => (
												<span
													key={tag}
													className="rounded-md px-2 py-0.5 text-xs font-medium"
													style={{
														backgroundColor: "rgb(var(--color-bg-secondary))",
														color: "rgb(var(--color-text-tertiary))"
													}}
												>
													{tag}
												</span>
											))}
										</div>
									</>
								)}
							</div>
						</div>

						{/* Arrow Icon */}
						<div className="flex shrink-0 items-center">
							<svg
								className="h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								style={{ color: "rgb(var(--color-text-tertiary))" }}
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
