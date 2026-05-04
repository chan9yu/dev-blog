// Components
export { SeriesNavigation, TrendingSeries } from "./components";

// Services (서버 전용)
export type { SeriesAdjacency } from "./services";
export { getAdjacentInSeries, getAllSeries, getSeriesDetail, getSeriesStats, getTrendingSeries } from "./services";
export type { Series, SeriesStats } from "@/shared/types";
