/**
 * MOD-views Public API — PRD_TECHNICAL §7.5
 *
 * - Components: ViewCounter (M3-10 Green — slug 기반 useViews 연결 완료)
 * - Hooks: useViews (M3-10 Green — POST +1 + GET, sessionStorage dedup)
 * - Services: kv-client (M3-06 Green — fetch 기반, KV 실패 시 조용히 0 또는 null)
 *
 * 저장소: Route Handler는 `@vercel/kv`(`kv.get`/`kv.incr`) 사용 (ADR-003, M3-08 완료).
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). KV 실패 시 "—"/0 fallback.
 */

export { ViewCounter } from "./components";
export { useViews } from "./hooks";
export { fetchPostViewsOrNull, getBatchPostViews, getPostViews, incrementPostViews } from "./services";
