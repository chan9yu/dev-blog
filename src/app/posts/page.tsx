import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Posts",
	description:
		"chan9yu 개발 블로그의 전체 포스트 목록. React, TypeScript, Next.js, WebRTC 등 프론트엔드 실무 경험과 학습 기록을 모은 기술 글 모음입니다.",
	alternates: { canonical: "/posts" }
};

export default function PostsPage() {
	return (
		<section className="max-w-content mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="text-h1">Posts</h1>
			<p className="text-muted-foreground mt-4">
				M1에서 포스트 목록 UI 구현 예정 (그리드/리스트 토글 · 태그 필터 · 무한 스크롤).
			</p>
		</section>
	);
}
