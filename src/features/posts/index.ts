/**
 * MOD-posts Public API — PRD_TECHNICAL §7.1
 *
 * 현재(M1): 뼈대. 공개 타입만 재export.
 *
 * 향후 추가 (PRD §7.1 계약):
 * - 컴포넌트 (M1-22~M1-43): PostCard, PostList, PostDetail, Toc, RelatedPosts, PostNavigation, ShareButtons
 * - 훅 (M1-29): useReadingProgress
 * - 서비스 (M2-12~M2-17, M4-11~M4-18): getAllPosts, getPostDetail, findAdjacentPosts, findRelatedPostsByTags, getTrendingPosts
 * - 유틸 (M2-06): calculateReadingTime
 * - 추가 타입 (M1-15 본편): AdjacentPosts, RelatedPost
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). 공유 타입은 shared/types만.
 */

export type { PostDetail, PostSummary, TocItem, TrendingSnapshot } from "@/shared/types";
