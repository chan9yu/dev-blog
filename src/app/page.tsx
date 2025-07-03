import Link from "next/link";

import PostCard from "@/features/main/components/PostCard";
import ProfileSection from "@/features/main/components/ProfileSection";
import TagSection from "@/features/main/components/TagSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { notionService } from "@/shared/lib/notion";

type MainPageProps = {
	searchParams: Promise<{ tag?: string }>;
};

export default async function MainPage({ searchParams }: MainPageProps) {
	const { tag } = await searchParams;
	const selectedTagName = tag || notionService.allTagInfo.name;

	const [blogPosts, tags] = await Promise.all([notionService.getBlogPosts(selectedTagName), notionService.getTags()]);

	return (
		<div className="container py-8">
			<div className="grid grid-cols-[200px_1fr_220px] gap-6">
				{/* 좌측 사이드바 */}
				<aside>
					<TagSection selectedTagName={selectedTagName} tags={tags} />
				</aside>

				<div className="space-y-8">
					{/* 섹션 제목 */}
					<div className="flex items-center justify-between">
						<h2 className="text-3xl font-bold tracking-tight">
							{selectedTagName === notionService.allTagInfo.name ? "블로그 목록" : `${selectedTagName} 관련 글`}
						</h2>
						<Select defaultValue="latest">
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="정렬 방식 선택" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="latest">최신순</SelectItem>
								<SelectItem value="oldest">오래된순</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* 블로그 카드 그리드 */}
					<div className="grid gap-4">
						{/* 블로그 카드 반복 */}
						{blogPosts.map((post) => (
							<Link href={`/blog/${post.slug}`} key={post.id}>
								<PostCard post={post} />
							</Link>
						))}
					</div>
				</div>

				{/* 우측 사이드바 */}
				<aside className="flex flex-col gap-6">
					<ProfileSection />
				</aside>
			</div>
		</div>
	);
}
