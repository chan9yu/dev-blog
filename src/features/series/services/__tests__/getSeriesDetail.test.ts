import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/shared/types";

import { getSeriesDetail } from "../getSeriesDetail";

const post = (slug: string, overrides: Partial<PostSummary> = {}): PostSummary => ({
	title: slug,
	description: "desc",
	slug,
	date: "2026-01-01",
	private: false,
	tags: [],
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1,
	...overrides
});

describe("getSeriesDetail", () => {
	it("매칭되는 시리즈를 반환한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: 1 }), post("b", { series: "S2", seriesOrder: 1 })];
		const result = getSeriesDetail(posts, "S1");
		expect(result?.name).toBe("S1");
		expect(result?.posts).toHaveLength(1);
	});

	it("매칭되지 않으면 null을 반환한다", () => {
		const posts = [post("a", { series: "S1", seriesOrder: 1 })];
		expect(getSeriesDetail(posts, "missing")).toBeNull();
	});

	it("빈 입력에는 null을 반환한다", () => {
		expect(getSeriesDetail([], "anything")).toBeNull();
	});

	it("posts는 seriesOrder 오름차순으로 정렬되어 반환된다", () => {
		const posts = [
			post("a", { series: "S1", seriesOrder: 3 }),
			post("b", { series: "S1", seriesOrder: 1 }),
			post("c", { series: "S1", seriesOrder: 2 })
		];
		const result = getSeriesDetail(posts, "S1");
		expect(result?.posts.map((p) => p.slug)).toEqual(["b", "c", "a"]);
	});
});
