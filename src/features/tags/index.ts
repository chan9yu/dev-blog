/**
 * MOD-tags Public API — PRD_TECHNICAL §7.2
 *
 * 현재(M1): 뼈대. 공개 타입만 재export.
 *
 * 향후 추가 (PRD §7.2 계약):
 * - 컴포넌트 (M1-44~M1-46): TagList, TagHub, TagChip
 * - 서비스 (M4-01~M4-05): getAllTags, getPostsByTag, getTagCounts, getTrendingTags
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export type { TagCount } from "@/shared/types";
