import { expect, test } from "@playwright/test";

test.describe("M7-03 TOC 클릭 스크롤", () => {
	test("포스트 상세에서 TOC 항목 클릭 시 해당 heading으로 스크롤된다", async ({ page }) => {
		await page.goto("/posts");

		const firstCard = page
			.locator("main")
			.getByRole("link")
			.filter({ has: page.locator("h3") })
			.first();
		await firstCard.click();
		await expect(page).toHaveURL(/\/posts\/[\w-]+/);

		// TOC는 lg+ 뷰포트에서만 sticky aside에 표시된다 (Desktop Chrome 1280×720 기본)
		const tocNav = page.getByRole("navigation", { name: /목차|TOC|Table of Contents/i });
		const tocVisible = await tocNav.isVisible().catch(() => false);
		test.skip(!tocVisible, "TOC 항목이 없는 포스트 또는 모바일 viewport — skip");

		const tocLinks = tocNav.getByRole("link");
		const tocCount = await tocLinks.count();
		test.skip(tocCount === 0, "TOC 빈 포스트 — skip");

		const targetLink = tocLinks.nth(Math.min(1, tocCount - 1));
		const hash = await targetLink.getAttribute("href");
		expect(hash).toMatch(/^#/);

		await targetLink.click();

		// 한글 heading id는 브라우저 URL에서 percent-encoded되므로 raw hash로 매칭하면 실패한다.
		const encodedHash = encodeURI(hash ?? "");
		await expect.poll(() => page.url().endsWith(encodedHash), { timeout: 3_000 }).toBe(true);

		// 클릭한 heading이 viewport 상단 근처에 위치 — attribute selector는 한글 id도 escape 없이 처리
		const headingId = decodeURIComponent(hash ?? "").slice(1);
		const heading = page.locator(`[id="${headingId}"]`);
		await expect(heading).toBeInViewport({ ratio: 0.5 });
	});
});
