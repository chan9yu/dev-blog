import { expect, test } from "@playwright/test";

test.describe("M7-02 Cmd+K 검색 스모크", () => {
	test("Meta+K로 검색 모달이 열리고 결과 클릭 시 상세로 이동한다", async ({ page }) => {
		await page.goto("/");

		// MacOS Meta / Linux·Windows Control 양쪽 호환
		const isMac = process.platform === "darwin";
		await page.keyboard.press(isMac ? "Meta+k" : "Control+k");

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();

		const input = dialog.getByLabel("검색어");
		await expect(input).toBeFocused();

		// 빈 검색창 추천 영역(M7-08)이 보여야 한다
		await expect(dialog.getByRole("heading", { name: /인기 태그/ })).toBeVisible();

		// 영문 태그/포스트 본문에 등장할 가능성이 높은 일반 키워드
		await input.fill("react");

		const firstResult = dialog.getByRole("link").first();
		await expect(firstResult).toBeVisible({ timeout: 2_000 });

		const href = await firstResult.getAttribute("href");
		await firstResult.click();

		await expect(page).toHaveURL(href ?? /\/(posts|tags)\//);
	});

	test("ESC로 검색 모달이 닫힌다", async ({ page }) => {
		await page.goto("/");

		const isMac = process.platform === "darwin";
		await page.keyboard.press(isMac ? "Meta+k" : "Control+k");
		await expect(page.getByRole("dialog")).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(page.getByRole("dialog")).toBeHidden();
	});
});
