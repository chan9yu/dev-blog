import type { Metadata } from "next";
import Link from "next/link";

import { getTagCounts } from "@/features/tags";
import ChevronRightIcon from "@/shared/assets/icons/chevron-right.svg";
import TagIcon from "@/shared/assets/icons/tag.svg";
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
					<TagIcon className="mb-4 size-16" />
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
								<div className="min-w-0 flex-1 space-y-2">
									<div className="flex min-w-0 items-center gap-2">
										<TagIcon className="text-accent size-5 shrink-0" />
										<h2 className="text-primary group-hover-accent min-w-0 flex-1 truncate font-semibold tracking-tight transition-colors">
											{tag}
										</h2>
									</div>
									<p className="text-tertiary text-sm">{count}개의 포스트</p>
								</div>
								<ChevronRightIcon className="text-tertiary size-5 shrink-0 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
