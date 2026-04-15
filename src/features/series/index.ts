/**
 * MOD-series Public API — PRD_TECHNICAL §7.3
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 * 배럴 정책: 서버/클라이언트 혼재 — Turbopack tree shake 의존 (project-structure.md §배럴 정책 참조).
 */

// Components (서버 전용 — 현재 클라이언트 컴포넌트 없음)
export { SeriesNavigation, TrendingSeries } from "./components";

// Services (100% 서버 전용)
export type { SeriesAdjacency } from "./services";
export { getAdjacentInSeries } from "./services";

// Types (컴파일 타임 전용)
export type { Series } from "@/shared/types";
