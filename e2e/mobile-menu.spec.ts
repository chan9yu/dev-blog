import { devices, expect, test } from "@playwright/test";

// MobileMenu 트리거는 `md:hidden`이라 모바일 viewport에서만 노출 — 단일 project 안에서 viewport 격리.
test.use({ ...devices["Pixel 7"] });

test.describe("M7-05 모바일 Drawer", () => {
	test("모바일 viewport에서 햄버거 클릭 시 Sheet drawer가 열린다", async ({ page }) => {
		await page.goto("/");

		const trigger = page.getByRole("button", { name: /메뉴|menu/i }).first();
		await expect(trigger).toBeVisible();

		await trigger.click();

		const drawer = page.getByRole("dialog");
		await expect(drawer).toBeVisible();

		// Drawer 내부에 nav 링크들이 노출되어야 한다
		const navLinks = drawer.getByRole("link");
		const linkCount = await navLinks.count();
		expect(linkCount).toBeGreaterThan(0);

		// ESC로 닫힘
		await page.keyboard.press("Escape");
		await expect(drawer).toBeHidden();
	});
});
