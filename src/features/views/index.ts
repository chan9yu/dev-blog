/**
 * MOD-views Public API — PRD_TECHNICAL §7.5
 *
 * 현재(M1): ViewCounter placeholder.
 *
 * 향후:
 * - M3-05~08: getPostViews, incrementPostViews, getBatchPostViews (kv-client)
 * - M3-09: useViews 훅
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). KV 실패 시 "—" fallback.
 */

export { ViewCounter } from "./components";
