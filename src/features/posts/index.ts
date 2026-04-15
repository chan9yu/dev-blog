/**
 * MOD-posts Public API — PRD_TECHNICAL §7.1
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 * 배럴 정책: 서버/클라이언트 혼재 — Turbopack tree shake 의존 (project-structure.md §배럴 정책 참조).
 * export 20+ 초과 시 split barrel(index.ts + client.ts)로 전환.
 */

// Components (서버·클라이언트 혼재 — Turbopack tree shake 의존)
export {
	PopularPosts,
	PostCard,
	PostList,
	PostListSkeleton,
	PostMetaHeader,
	PostNavigation,
	ReadingProgress,
	RelatedPosts,
	ScrollToTop,
	ShareButtons,
	TOC
} from "./components";

// Services (100% 서버 전용)
export { getAdjacentPosts, getPostBySlug, getPublicPosts, getRelatedPosts } from "./services";

// Types (컴파일 타임 전용)
export type { AdjacentPosts, PostDetail, PostSummary, RelatedPost, TocItem, TrendingSnapshot } from "@/shared/types";
