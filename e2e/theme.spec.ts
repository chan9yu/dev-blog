import { expect, test } from "@playwright/test";

test.describe("M7-04 테마 토글 영속성", () => {
	test("다크 모드 토글 후 새로고침해도 다크 모드가 유지된다", async ({ page }) => {
		await page.goto("/");

		const html = page.locator("html");

		// next-themes는 초기 hydration 후 mount 신호를 기다린 뒤 클래스를 적용
		const themeToggle = page.getByRole("button", { name: /테마|다크|라이트|theme|dark|light/i }).first();
		await expect(themeToggle).toBeVisible();

		const initialClass = (await html.getAttribute("class")) ?? "";
		const initiallyDark = initialClass.includes("dark");

		await themeToggle.click();

		// View Transitions API + setTimeout 흐름이 끝나고 클래스가 바뀔 때까지 기다림
		await expect
			.poll(
				async () => {
					const cls = (await html.getAttribute("class")) ?? "";
					return cls.includes("dark") !== initiallyDark;
				},
				{ timeout: 2_000 }
			)
			.toBe(true);

		const afterToggleDark = !initiallyDark;

		await page.reload();

		await expect
			.poll(
				async () => {
					const cls = (await html.getAttribute("class")) ?? "";
					return cls.includes("dark");
				},
				{ timeout: 2_000 }
			)
			.toBe(afterToggleDark);
	});
});
