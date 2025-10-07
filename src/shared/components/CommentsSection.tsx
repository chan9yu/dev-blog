"use client";

import { useEffect, useState } from "react";

import { getStoredTheme } from "../utils";
import { Comments } from "./Comments";

type CommentsSectionProps = {
	repo: string;
};

export function CommentsSection({ repo }: CommentsSectionProps) {
	const [theme, setTheme] = useState<"github-light" | "github-dark">("github-light");

	useEffect(() => {
		// 초기 테마 설정
		const currentTheme = getStoredTheme();
		setTheme(currentTheme === "dark" ? "github-dark" : "github-light");

		// 테마 변경 감지
		const handleThemeChange = () => {
			const newTheme = getStoredTheme();
			setTheme(newTheme === "dark" ? "github-dark" : "github-light");
		};

		// MutationObserver로 data-theme 속성 변경 감지
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
					handleThemeChange();
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"]
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
