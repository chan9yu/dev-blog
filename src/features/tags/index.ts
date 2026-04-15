/**
 * MOD-tags Public API — PRD_TECHNICAL §7.2
 *
 * 현재(M1): TagChip·TagList·TrendingTags + 공개 타입 재export.
 *
 * 향후 (PRD §7.2 계약):
 * - M4-01~M4-05: getAllTags, getPostsByTag, getTagCounts, getTrendingTags
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { TagChip, TagList, TrendingTags } from "./components";
export type { TagCount } from "@/shared/types";
