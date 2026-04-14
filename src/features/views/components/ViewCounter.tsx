import { Eye } from "lucide-react";

type ViewCounterProps = {
	slug: string;
	views?: number;
};

/**
 * 조회수 표시 placeholder. M3에서 `useViews(slug)` 훅으로 KV fetch 값 표시.
 * KV 실패 시 "—" fallback (PRD §7.5).
 */
export function ViewCounter({ views }: ViewCounterProps) {
	return (
		<span
			className="text-muted-foreground inline-flex items-center gap-1.5 text-sm"
			aria-label={views !== undefined ? `조회수 ${views}` : "조회수 정보 없음"}
		>
			<Eye className="size-4" aria-hidden />
			<span aria-hidden>{views !== undefined ? views.toLocaleString() : "—"}</span>
		</span>
	);
}
