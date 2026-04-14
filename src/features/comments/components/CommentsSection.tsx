"use client";

import { useEffect, useRef, useState } from "react";

type CommentsSectionProps = {
	slug: string;
};

/**
 * Giscus 댓글 placeholder. IntersectionObserver로 뷰포트 진입 시에만 mount.
 * M3-12에서 실제 Giscus 스크립트 주입 (NEXT_PUBLIC_GISCUS_* 환경변수 의존).
 */
export function CommentsSection({ slug }: CommentsSectionProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	return (
		<section ref={containerRef} aria-labelledby="comments-title" className="space-y-4" data-post-slug={slug}>
			<h2 id="comments-title" className="text-foreground text-lg font-semibold">
				댓글
			</h2>
			<div className="bg-muted text-muted-foreground min-h-32 rounded-md p-6 text-center text-sm">
				{shouldLoad ? (
					<p>Giscus 댓글 위젯이 M3에서 활성화됩니다. 환경변수 NEXT_PUBLIC_GISCUS_* 설정 후 실제 iframe이 렌더됩니다.</p>
				) : (
					<p>스크롤하면 댓글이 로드됩니다.</p>
				)}
			</div>
		</section>
	);
}
