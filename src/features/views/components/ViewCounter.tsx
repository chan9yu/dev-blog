"use client";

import { useViews } from "@/features/views/hooks";

type ViewCounterProps = {
	slug: string;
	className?: string;
};

/**
 * 포스트 조회수 표시 컴포넌트
 * - 자동으로 조회수 증가
 * - 현재 조회수 표시
 */
export function ViewCounter({ slug, className }: ViewCounterProps) {
	const { views, isLoading } = useViews(slug);

	if (isLoading) {
		return (
			<span className={className}>
				<span className="inline-block w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700">&nbsp;</span>
			</span>
		);
	}

	return <span className={className}>{views !== null ? views.toLocaleString("ko-KR") : "0"}회</span>;
}
