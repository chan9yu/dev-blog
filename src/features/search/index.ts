/**
 * MOD-search Public API — PRD_TECHNICAL §7.4
 *
 * 현재(M1): 뼈대. 공개 타입 없음 (전용 `SearchResult` 타입은 M3 구현 시 feature 내부에서 정의).
 *
 * 향후 추가 (PRD §7.4 계약):
 * - 컴포넌트 (M1-51~M1-54): SearchButton, SearchModal, SearchResultItem
 * - 훅 (M1-53, M3-01~M3-04): useSearch, useSearchShortcut
 * - 타입: SearchResult (feature 내부 types.ts에서 정의 후 export)
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export {};
