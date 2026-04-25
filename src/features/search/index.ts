/**
 * MOD-search Public API — PRD_TECHNICAL §7.4
 *
 * M3-04 이후 구성:
 * - `SearchTrigger` — Header 등에서 ⌘K 단축키까지 묶어 쓰는 기본 조립체
 * - `SearchButton` — 아이콘 버튼 UI만 독립 사용 (커맨드 팔레트 병합 등)
 * - `SearchModal` — 검색 UX(입력·debounce·결과·키보드 내비) 단독 사용
 * - `SearchResultItem` — Fuse match indices 하이라이트 포함 결과 렌더
 * - `useSearch` — Fuse.js 기반 검색 훅 (debounce 200ms, limit 10)
 * - `useSearchShortcut` — ⌘K / Ctrl+K 전역 단축키
 * - type `SearchResult` — post + score + matches 집합
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

// Components (서버·클라이언트 혼재 — Turbopack tree shake 의존)
export { SearchButton, SearchModal, SearchResultItem, SearchTrigger } from "./components";
// Hooks (100% 클라이언트 전용)
export { useSearch, useSearchShortcut } from "./hooks";
// Types (컴파일 타임 전용)
export type { SearchResult } from "./types";
