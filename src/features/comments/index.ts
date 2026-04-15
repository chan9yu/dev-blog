/**
 * MOD-comments Public API — PRD_TECHNICAL §7.6
 *
 * 현재(M1): CommentsSection placeholder (IntersectionObserver lazy-mount).
 *
 * 향후:
 * - M3-11~12: 실제 Giscus iframe 주입 + 테마 동기화
 *
 * 환경변수 의존: NEXT_PUBLIC_GISCUS_REPO, REPO_ID, CATEGORY, CATEGORY_ID.
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { CommentsSection } from "./components";
