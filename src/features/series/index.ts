/**
 * MOD-series Public API — PRD_TECHNICAL §7.3
 *
 * 현재(M1): TrendingSeries·SeriesNavigation + 공개 타입 재export.
 *
 * 향후 추가 (PRD §7.3 계약):
 * - 컴포넌트 (M1-47~M1-48): SeriesCard, SeriesPosts, PopularSeries, SeriesDetail, SeriesHub 페이지 컴포넌트
 * - 서비스 (M4-06~M4-10): getAllSeries, getSeriesDetail, getSeriesStats, getTrendingSeries
 *
 * 규칙: 다른 feature를 import하지 않는다 (Law 3).
 */

export { SeriesNavigation, TrendingSeries } from "./components";
export type { Series } from "@/shared/types";
