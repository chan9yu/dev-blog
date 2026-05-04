import { ChevronRight, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getPublicPosts } from "@/features/posts";
import { getTagCounts } from "@/features/tags";
import { Container } from "@/shared/components/layouts/Container";
import { buildMetadata } from "@/shared/seo";
import { formatLocalizedSlug } from "@/shared/utils/formatLocalizedSlug";

export const metadata: Metadata = buildMetadata({
	title: "태그",
	description:
		"주제별 태그로 정리된 포스트를 탐색하세요. React, TypeScript, Next.js, WebRTC 등 다양한 기술 주제를 한눈에 확인할 수 있고, 관심 있는 주제별로 포스트를 빠르게 찾을 수 있는 허브 페이지입니다.",
	path: "/tags"
});

export default function TagsHubPage() {
	const tags = getTagCounts(getPublicPosts());

	return (
		<Container>
			<div className="space-y-8 py-8 lg:py-10">
				<header className="space-y-3">
					<h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">태그</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">모든 태그를 한눈에 확인하세요</p>
				</header>

				{tags.length === 0 ? (
					<div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
						<Tag className="mb-4 size-16" aria-hidden />
						<p className="text-lg font-medium">아직 태그가 없습니다</p>
					</div>
				) : (
					<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="태그 목록">
						{tags.map((item) => (
							<li key={item.slug}>
								<Link
									href={`/tags/${item.slug}`}
									className="group bg-card border-border-subtle focus-visible:ring-ring block rounded-xl border p-6 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1 space-y-2">
											<div className="flex min-w-0 items-center gap-2">
												<Tag className="text-accent size-5 shrink-0" aria-hidden />
												<h2 className="text-card-foreground group-hover:text-accent min-w-0 flex-1 truncate font-semibold tracking-tight transition-colors">
													{formatLocalizedSlug(item.tag)}
												</h2>
											</div>
											<p className="text-muted-foreground text-sm">{item.count}개의 포스트</p>
										</div>
										<ChevronRight
											className="text-muted-foreground size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
											aria-hidden
										/>
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</Container>
	);
}
