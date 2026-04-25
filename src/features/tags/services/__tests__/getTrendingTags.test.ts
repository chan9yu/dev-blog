import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/shared/types";

import { getTrendingTags } from "../getTrendingTags";

const post = (slug: string, tags: string[], isPrivate = false): PostSummary => ({
	title: slug,
	description: "desc",
	slug,
	date: "2026-01-01",
	private: isPrivate,
	tags,
	thumbnail: null,
	series: null,
	seriesOrder: null,
	readingTimeMinutes: 1
});

describe("getTrendingTags", () => {
	it("기본 limit은 10이다", () => {
		const posts = Array.from({ length: 12 }, (_, i) => post(`p${i}`, [`tag${i}`]));
		expect(getTrendingTags(posts)).toHaveLength(10);
	});

	it("count 내림차순 상위 N개를 반환한다", () => {
		const posts = [post("a", ["react"]), post("b", ["react", "tdd"]), post("c", ["react"]), post("d", ["typescript"])];
		const result = getTrendingTags(posts, 2);
		expect(result[0]).toEqual({ tag: "react", slug: "react", count: 3 });
		expect(result[1]?.count).toBe(1);
	});

	it("count 동률은 tag 알파벳 오름차순으로 정렬한다", () => {
		const posts = [post("a", ["zebra"]), post("b", ["alpha"])];
		const result = getTrendingTags(posts, 5);
		expect(result.map((t) => t.tag)).toEqual(["alpha", "zebra"]);
	});

	it("limit이 unique 태그 수보다 크면 모두 반환한다", () => {
		const posts = [post("a", ["react"])];
		expect(getTrendingTags(posts, 10)).toHaveLength(1);
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getTrendingTags([], 10)).toEqual([]);
	});

	it("private 제외는 호출자 책임 — getTagCounts 동작에 의존", () => {
		const posts = [post("p", ["react"], true), post("q", ["typescript"], false)];
		expect(getTrendingTags(posts, 5).map((t) => t.tag)).toEqual(["react", "typescript"]);
	});
});
