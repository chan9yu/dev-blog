"use client";

import { useEffect, useState } from "react";

import { Comments } from "./Comments";

type CommentsSectionProps = {
	repo: string;
	initialTheme?: "github-light" | "github-dark";
};

export function CommentsSection({ repo, initialTheme = "github-light" }: CommentsSectionProps) {
	const [theme, setTheme] = useState<"github-light" | "github-dark">(initialTheme);

	useEffect(() => {
		// 현재 테마 확인 함수
		const getCurrentTheme = (): "github-light" | "github-dark" => {
			return document.documentElement.classList.contains("dark") ? "github-dark" : "github-light";
		};

		// 초기 테마 설정
		setTheme(getCurrentTheme());

		// 테마 변경 핸들러 (Custom event에서 호출)
		const handleThemeChange = () => {
			setTheme(getCurrentTheme());
		};

		// Listen to custom theme change event (fired by ThemeSwitcher)
		window.addEventListener("themeChange", handleThemeChange);

		return () => {
			window.removeEventListener("themeChange", handleThemeChange);
		};
	}, []);

	return (
		<section className="border-primary mt-16 border-t pt-8">
			<h2 className="text-primary mb-6 text-xl font-bold tracking-tight">댓글</h2>
			<Comments repo={repo} theme={theme} />
		</section>
	);
}
