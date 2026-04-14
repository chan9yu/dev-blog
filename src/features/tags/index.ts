/**
 * MOD-tags Public API — PRD_TECHNICAL §7.2
 *
 * 현재(M1): TagChip·TrendingTags + 공개 타입 재export.
 *
 * 향후 추가 (PRD §7.2 계약):
 * - 컴포넌트 (M4): TagList, TagHub 페이지 컴포넌트
 * - 서비스 (M4-01~M4-05): getAllTags, getPostsByTag, getTagCounts, getTrendingTags
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { TagChip, TrendingTags } from "./components";
export type { TagCount } from "@/shared/types";
