import { describe, expect, it } from "vitest";

import { loadBadgeFonts } from "../badge";

describe("loadBadgeFonts", () => {
	it("Pretendard Regular(400)·Bold(700) 2종을 Buffer로 로드한다", () => {
		const fonts = loadBadgeFonts();
		expect(fonts).toHaveLength(2);
		expect(fonts.map((f) => f.weight).sort()).toEqual([400, 700]);
		for (const font of fonts) {
			expect(font.name).toBe("Pretendard");
			expect(font.data.length).toBeGreaterThan(1000);
		}
	});
});
