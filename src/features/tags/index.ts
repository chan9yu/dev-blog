/**
 * MOD-tags Public API — PRD_TECHNICAL §7.2
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 *
 * M2-23: getAllTags 선행 도입 (PostSummary[] 매개변수 방식, Law 3 준수).
 * M4-01~M4-05: getPostsByTag, getTagCounts, getTrendingTags 확장 예정.
 */

export { TagChip, TagList, TrendingTags } from "./components";

// Services (100% 서버 전용)
export { getAllTags } from "./services";

// Types (컴파일 타임 전용)
export type { TagCount } from "@/shared/types";
