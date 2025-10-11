"use client";

import { useEffect, useRef } from "react";

type CommentsProps = {
	repo: string;
	theme: "github-light" | "github-dark";
};

export function Comments({ repo, theme }: CommentsProps) {
	const commentsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const commentsElement = commentsRef.current;
		if (!commentsElement) return;

		// 기존 iframe이 있는지 확인
		const existingIframe = commentsElement.querySelector<HTMLIFrameElement>("iframe.utterances-frame");

		// 이미 로드되었으면 테마만 변경
		if (existingIframe?.contentWindow) {
			try {
				existingIframe.contentWindow.postMessage(
					{
						type: "set-theme",
						theme: theme
					},
					"https://utteranc.es"
				);
				return;
			} catch (error) {
				console.warn("Failed to update Utterances theme:", error);
			}
		}

		// 기존 스크립트 제거 (처음 로드 시에만)
		const existingScript = commentsElement.querySelector("script[src*='utteranc.es']");
		if (existingScript) {
			return; // 이미 스크립트가 있으면 중복 로드 방지
		}

		// 스크립트 로드
		const scriptElement = document.createElement("script");
		scriptElement.src = "https://utteranc.es/client.js";
		scriptElement.async = true;
		scriptElement.crossOrigin = "anonymous";
		scriptElement.setAttribute("repo", repo);
		scriptElement.setAttribute("issue-term", "pathname");
		scriptElement.setAttribute("theme", theme);
		scriptElement.setAttribute("label", "comment");

		commentsElement.appendChild(scriptElement);
	}, [repo, theme]);

	return <div ref={commentsRef} />;
}
