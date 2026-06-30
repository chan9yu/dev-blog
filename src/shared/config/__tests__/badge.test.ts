import { describe, expect, it } from "vitest";

import { BADGE_RECENT_COUNT, isBadgeTheme, parseBadgeIndex } from "../badge";

describe("parseBadgeIndex", () => {
	it("0 이상 BADGE_RECENT_COUNT 미만 정수 문자열을 숫자로 변환한다", () => {
		expect(parseBadgeIndex("0")).toBe(0);
		expect(parseBadgeIndex(String(BADGE_RECENT_COUNT - 1))).toBe(BADGE_RECENT_COUNT - 1);
	});

	it("범위를 벗어나거나 정수가 아니면 null", () => {
		expect(parseBadgeIndex(String(BADGE_RECENT_COUNT))).toBeNull();
		expect(parseBadgeIndex("-1")).toBeNull();
		expect(parseBadgeIndex("1.5")).toBeNull();
		expect(parseBadgeIndex("abc")).toBeNull();
		expect(parseBadgeIndex("")).toBeNull();
	});
});

describe("isBadgeTheme", () => {
	it("dark/light만 true", () => {
		expect(isBadgeTheme("dark")).toBe(true);
		expect(isBadgeTheme("light")).toBe(true);
		expect(isBadgeTheme("blue")).toBe(false);
	});
});
