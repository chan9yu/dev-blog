/**
 * MOD-views Public API — PRD_TECHNICAL §7.5
 *
 * 현재(M1): 뼈대. 공개 타입 없음.
 *
 * 향후 추가 (PRD §7.5 계약):
 * - 컴포넌트 (M1-55): ViewCounter
 * - 훅 (M3-09): useViews
 * - 서비스 (M3-05~M3-08): getPostViews, incrementPostViews, getBatchPostViews (kv-client)
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3). KV 실패 시 "—" fallback.
 */

export {};
