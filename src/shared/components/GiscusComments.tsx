"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

import { giscusConfig } from "@/shared/constants";

type GiscusCommentsProps = {
	initialTheme?: "light" | "dark";
};

export function GiscusComments({ initialTheme = "light" }: GiscusCommentsProps) {
	const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

	useEffect(() => {
		// 현재 테마 확인 함수
		const getCurrentTheme = (): "light" | "dark" => {
			return document.documentElement.classList.contains("dark") ? "dark" : "light";
		};

		// 초기 테마 설정
		setTheme(getCurrentTheme());

		// 테마 변경 핸들러
		const handleThemeChange = () => {
			setTheme(getCurrentTheme());
		};

		// Listen to custom theme change event (fired by ThemeSwitcher)
		window.addEventListener("themeChange", handleThemeChange);

		return () => {
			window.removeEventListener("themeChange", handleThemeChange);
		};
	}, []);

	return <Giscus {...giscusConfig} theme={theme === "dark" ? "dark" : "light"} />;
}
