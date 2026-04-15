import { describe, expect, it } from "vitest";

import { slugify } from "../slugify";

describe("slugify", () => {
	it("영문 소문자로 변환", () => {
		expect(slugify("Hello World")).toBe("hello-world");
	});

	it("숫자 보존", () => {
		expect(slugify("React 19 Features")).toBe("react-19-features");
	});

	it("한글 보존", () => {
		expect(slugify("리액트 19")).toBe("리액트-19");
	});

	it("특수문자 제거 후 slug화", () => {
		expect(slugify("use() 훅 완벽이해")).toBe("use-훅-완벽이해");
	});

	it("연속 공백 → 단일 하이픈", () => {
		expect(slugify("hello   world")).toBe("hello-world");
	});

	it("앞뒤 공백 제거", () => {
		expect(slugify("  hello  ")).toBe("hello");
	});

	it("앞뒤 하이픈 제거", () => {
		expect(slugify("  (hello)  ")).toBe("hello");
	});

	it("연속 하이픈 단일화", () => {
		expect(slugify("hello--world")).toBe("hello-world");
	});

	it("빈 문자열 → 빈 문자열", () => {
		expect(slugify("")).toBe("");
	});

	it("특수문자만 있는 경우 빈 문자열", () => {
		expect(slugify("!!!")).toBe("");
	});
});
