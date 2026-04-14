import type { PostSummary, Series } from "@/shared/types";

import { postsFixture } from "./posts";

type SeriesMeta = { name: string; slug: string };

/**
 * 시리즈 slug → 표시용 이름 매핑.
 * slug는 posts의 `series` 필드 값과 1:1 대응되어야 한다 (kebab-case 영문).
 */
const SERIES_META: SeriesMeta[] = [
	{ slug: "react-19-deep-dive", name: "React 19 Deep Dive" },
	{ slug: "nextjs-app-router-patterns", name: "Next.js App Router Patterns" },
	{ slug: "typescript-type-system", name: "TypeScript Type System" }
];

const collectSeriesPosts = (slug: string): PostSummary[] =>
	postsFixture
		.filter((post) => post.series === slug && !post.private)
		.sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

/**
 * 더미 Series 배열 — `postsFixture`에서 파생.
 *
 * 구성:
 * - `react-19-deep-dive`: 3편 (use-hook → compiler-deep-dive → form-actions)
 * - `nextjs-app-router-patterns`: 3편 (cache-components → partial-prerendering → server-actions-security)
 * - `typescript-type-system`: 2편 (template-literal-types → conditional-types)
 *
 * `posts`는 `seriesOrder` 오름차순. private 포스트는 모든 시리즈 집계에서 제외 (ADR-007).
 */
export const seriesFixture: Series[] = SERIES_META.map(({ slug, name }) => ({
	name,
	slug,
	posts: collectSeriesPosts(slug)
}));
