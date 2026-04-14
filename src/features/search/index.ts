/**
 * MOD-search Public API — PRD_TECHNICAL §7.4
 *
 * 현재(M1): SearchTrigger(검색 버튼 + Dialog + 결과 리스트 통합) + 단축키 훅.
 *
 * 향후 (PRD §7.4 계약):
 * - M3-02: useSearch — Fuse.js 인덱스 기반 검색 로직 분리. 현재는 SearchTrigger 내부의 단순 includes 필터.
 * - M3-04: 실 Fuse 연결.
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { SearchTrigger } from "./components";
export { useSearchShortcut } from "./hooks";
