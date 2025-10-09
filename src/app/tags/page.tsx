import type { Metadata } from "next";
import Link from "next/link";

import { getTagCounts } from "@/features/tags";
import { SITE } from "@/shared/config";

export const metadata: Metadata = {
	title: "태그",
	description:
		"주제별 태그로 정리된 포스트를 탐색하세요. React, TypeScript, Next.js 등 다양한 기술 주제를 확인할 수 있습니다.",
	openGraph: {
		title: "태그 · chan9yu",
		description: "주제별 태그로 정리된 포스트 모음",
		type: "website",
		url: `${SITE.url}/tags`
	},
	alternates: {
		canonical: `${SITE.url}/tags`
	}
};

export default async function TagsPage() {
	const tagCounts = await getTagCounts();
	const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

	return (
		<div className="space-y-8">
			{/* Header */}
			<header className="space-y-3">
				<h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">태그</h1>
				<p className="text-secondary text-sm leading-relaxed sm:text-base">모든 태그를 한눈에 확인하세요</p>
			</header>

			{/* Tags Grid */}
			{sortedTags.length === 0 ? (
				<div className="text-tertiary flex flex-col items-center justify-center py-16 text-center">
					<svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
						/>
					</svg>
					<p className="text-lg font-medium">아직 태그가 없습니다</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{sortedTags.map(([tag, count]) => (
						<Link
							key={tag}
							href={`/tags/${encodeURIComponent(tag)}`}
							className="bg-primary border-primary group rounded-xl border p-6 transition-all hover:shadow-md"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-2">
										<svg className="text-accent h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
											/>
										</svg>
										<h2 className="text-primary group-hover-accent font-semibold tracking-tight transition-colors">
											{tag}
										</h2>
									</div>
									<p className="text-tertiary text-sm">{count}개의 포스트</p>
								</div>
								<svg
									className="text-tertiary h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
