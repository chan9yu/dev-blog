/**
 * MOD-views Public API — PRD_TECHNICAL §7.5
 *
 * - Components: ViewCounter (M1 placeholder → M3-09에서 useViews 연결 예정)
 * - Services: kv-client (M3-06 Green — fetch 기반, KV 실패 시 조용히 0)
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). KV 실패 시 "—"/0 fallback.
 */

export { ViewCounter } from "./components";
export { getBatchPostViews, getPostViews, incrementPostViews } from "./services";
