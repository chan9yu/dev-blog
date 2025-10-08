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

		// 테마 변경 감지
		const handleThemeChange = () => {
			setTheme(getCurrentTheme());
		};

		// MutationObserver로 class 속성 변경 감지 (dark 클래스)
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "class") {
					handleThemeChange();
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<section className="mt-16 border-t pt-8" style={{ borderColor: "rgb(var(--color-border-primary))" }}>
			<h2 className="mb-6 text-xl font-bold tracking-tight" style={{ color: "rgb(var(--color-text-primary))" }}>
				댓글
			</h2>
			<Comments repo={repo} theme={theme} />
		</section>
	);
}
