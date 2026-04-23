/**
 * MOD-comments Public API — PRD_TECHNICAL §7.6
 *
 * M3-12 Green: Giscus(GitHub Discussions) DIY 로더 완성.
 *
 * - 환경변수 의존: NEXT_PUBLIC_GISCUS_REPO, REPO_ID, CATEGORY, CATEGORY_ID.
 * - isPrivate=true 포스트는 댓글 섹션 비렌더 (개인 포스트 노출 방지).
 * - IntersectionObserver lazy-mount + next-themes postMessage 테마 동기화.
 * - `@giscus/react` 미설치 상태로 공식 `giscus.app/client.js` script 직접 주입 경량 구현.
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { CommentsSection } from "./components";
