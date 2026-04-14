/**
 * MOD-posts Public API — PRD_TECHNICAL §7.1
 *
 * 현재(M1): 컴포넌트 + 공개 타입 재export.
 *
 * 향후 추가 (PRD §7.1 계약):
 * - 컴포넌트 (M1-28~M1-43): PostDetail, Toc, RelatedPosts, PostNavigation, ShareButtons
 * - 훅 (M1-29): useReadingProgress
 * - 서비스 (M2-12~M2-17, M4-11~M4-18): getAllPosts, getPostDetail, findAdjacentPosts, findRelatedPostsByTags, getTrendingPosts
 * - 유틸 (M2-06): calculateReadingTime
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). 공유 타입은 shared/types만.
 */

export { PopularPosts, PostCard, PostList, PostListSkeleton } from "./components";
export type { AdjacentPosts, PostDetail, PostSummary, RelatedPost, TocItem, TrendingSnapshot } from "@/shared/types";
