import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/shared/components/Container";
import { seriesFixture } from "@/shared/fixtures/series";
import { formatDate } from "@/shared/utils/formatDate";
import { normalizeSlug } from "@/shared/utils/slug";

type SeriesDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) return { title: "Series" };
	const series = seriesFixture.find((item) => item.slug === normalized);
	if (!series) return { title: "Series" };
	return {
		title: `${series.name} 시리즈`,
		description: `${series.name} 시리즈의 연속된 포스트 ${series.posts.length}편.`,
		alternates: { canonical: `/series/${series.slug}` }
	};
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
	const { slug } = await params;
	const normalized = normalizeSlug(slug);
	if (!normalized) notFound();

	const series = seriesFixture.find((item) => item.slug === normalized);
	if (!series) notFound();

	const ordered = [...series.posts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

	return (
		<Container>
			<div className="space-y-10 py-10 lg:py-14">
				<header className="space-y-3">
					<span className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold">
						시리즈 · {series.posts.length}편
					</span>
					<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{series.name}</h1>
				</header>

				<ol className="border-border-subtle space-y-4 border-l-2">
					{ordered.map((post) => (
						<li key={post.slug} className="relative pl-6">
							<span
								aria-hidden
								className="bg-accent text-accent-foreground absolute top-1 -left-3 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums"
							>
								{post.seriesOrder}
							</span>
							<Link
								href={`/posts/${post.slug}`}
								className="group bg-card border-border focus-visible:ring-ring block rounded-lg border p-4 transition-colors hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<h2 className="text-card-foreground group-hover:text-accent line-clamp-2 text-base font-semibold transition-colors">
									{post.title}
								</h2>
								<p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">{post.description}</p>
								<time className="text-muted-foreground mt-2 block text-xs tabular-nums" dateTime={post.date}>
									{formatDate(post.date)}
								</time>
							</Link>
						</li>
					))}
				</ol>
			</div>
		</Container>
	);
}
