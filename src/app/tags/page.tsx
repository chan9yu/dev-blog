import type { Metadata } from "next";

import { TagChip } from "@/features/tags";
import { Container } from "@/shared/components/Container";
import { tagsFixture } from "@/shared/fixtures/tags";

export const metadata: Metadata = {
	title: "Tags",
	description:
		"chan9yu 개발 블로그의 태그 허브. 관심 주제별로 포스트를 탐색할 수 있도록 React, TypeScript, Next.js 등 모든 태그를 발행 빈도와 함께 한곳에 모았습니다.",
	alternates: { canonical: "/tags" }
};

export default function TagsHubPage() {
	return (
		<Container>
			<div className="space-y-10 py-10 lg:py-14">
				<header className="space-y-2">
					<h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Tags</h1>
					<p className="text-muted-foreground text-sm">총 {tagsFixture.length}개의 태그</p>
				</header>

				{tagsFixture.length === 0 ? (
					<p className="text-muted-foreground py-12 text-center text-sm">아직 태그가 없습니다.</p>
				) : (
					<ul className="flex flex-wrap gap-3">
						{tagsFixture.map((tag) => (
							<li key={tag.slug}>
								<TagChip tag={tag.tag} slug={tag.slug} count={tag.count} />
							</li>
						))}
					</ul>
				)}
			</div>
		</Container>
	);
}
