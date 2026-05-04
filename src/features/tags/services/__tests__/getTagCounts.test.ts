import { describe, expect, it } from "vitest";

import type { PostSummary } from "@/shared/types";

import { getTagCounts } from "../getTagCounts";

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

describe("getTagCounts", () => {
	it("count 내림차순으로 정렬한다", () => {
		const posts = [post("a", ["react"]), post("b", ["react", "tdd"]), post("c", ["react"])];
		const result = getTagCounts(posts);
		expect(result[0]).toEqual({ tag: "react", slug: "react", count: 3 });
		expect(result[1]).toEqual({ tag: "tdd", slug: "tdd", count: 1 });
	});

	it("count 동률은 tag 알파벳 오름차순으로 정렬한다", () => {
		const posts = [post("a", ["zebra", "alpha"])];
		const result = getTagCounts(posts);
		expect(result.map((t) => t.tag)).toEqual(["alpha", "zebra"]);
	});

	it("TagCount.tag와 slug는 동일한 원본 태그 값이다", () => {
		const posts = [post("a", ["TypeScript"])];
		expect(getTagCounts(posts)[0]).toEqual({ tag: "TypeScript", slug: "TypeScript", count: 1 });
	});

	it("빈 입력에는 빈 배열을 반환한다", () => {
		expect(getTagCounts([])).toEqual([]);
	});

	it("태그 없는 포스트만 있으면 빈 배열을 반환한다", () => {
		expect(getTagCounts([post("a", [])])).toEqual([]);
	});

	it("private 제외 정책은 호출자 책임 — private 포함 입력도 그대로 집계한다", () => {
		const posts = [post("p", ["react"], true)];
		expect(getTagCounts(posts)).toEqual([{ tag: "react", slug: "react", count: 1 }]);
	});
});
