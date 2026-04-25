"use client";

import { Eye } from "lucide-react";

import { useViews } from "../hooks/useViews";

type ViewCounterProps = {
	slug: string;
};

/**
 * 포스트 조회수 표시. 마운트 시 `useViews(slug)`가 POST +1 → GET 파이프라인을 실행.
 *
 * 상태별 렌더:
 * - 로딩: `조회수 불러오는 중` aria-label + `animate-pulse` 스켈레톤
 * - 성공: `조회수 N회` aria-label + `toLocaleString("ko-KR")` 포맷
 * - 실패: `조회수 정보 없음` aria-label + `— 회` 문구
 */
export function ViewCounter({ slug }: ViewCounterProps) {
	const { views, failed } = useViews(slug);

	if (failed) {
		return (
			<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm" aria-label="조회수 정보 없음">
				<Eye className="size-4" aria-hidden />
				<span aria-hidden>— 회</span>
			</span>
		);
	}

	if (views === null) {
		return (
			<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm" aria-label="조회수 불러오는 중">
				<Eye className="size-4" aria-hidden />
				<span aria-hidden className="bg-muted inline-block h-4 w-12 animate-pulse rounded" />
			</span>
		);
	}

	const label = `조회수 ${views}회`;

	return (
		<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm" aria-label={label}>
			<Eye className="size-4" aria-hidden />
			<span aria-hidden>{`${views.toLocaleString("ko-KR")}회`}</span>
		</span>
	);
}
