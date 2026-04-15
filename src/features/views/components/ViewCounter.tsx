import { Eye } from "lucide-react";

type ViewCounterProps = {
	slug: string;
	views?: number;
};

/**
 * 레거시 ViewCounter 디자인 참조:
 * - 숫자 + "회" 접미사 + toLocaleString("ko-KR") 3자리 콤마
 * - 로딩 중 placeholder: `w-12 animate-pulse rounded bg-muted`
 * - M3에서 useViews(slug) 훅으로 KV fetch 값 표시 예정
 */
export function ViewCounter({ views }: ViewCounterProps) {
	const label = views !== undefined ? `조회수 ${views}회` : "조회수 정보 없음";
	return (
		<span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm" aria-label={label}>
			<Eye className="size-4" aria-hidden />
			<span aria-hidden>{views !== undefined ? `${views.toLocaleString("ko-KR")}회` : "— 회"}</span>
		</span>
	);
}
