"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

import { giscusConfig } from "@/shared/constants";

type GiscusCommentsProps = {
	initialTheme?: "light" | "dark";
};

const getCurrentTheme = (): "light" | "dark" => {
	if (typeof window === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

export function GiscusComments({ initialTheme = "light" }: GiscusCommentsProps) {
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		const current = getCurrentTheme();
		return current !== "light" ? current : initialTheme;
	});

	useEffect(() => {
		const handleThemeChange = () => {
			setTheme(getCurrentTheme());
		};

		window.addEventListener("themeChange", handleThemeChange);

		return () => {
			window.removeEventListener("themeChange", handleThemeChange);
		};
	}, []);

	return <Giscus {...giscusConfig} theme={theme === "dark" ? "dark" : "light"} />;
}
