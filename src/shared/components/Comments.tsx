"use client";

import { useEffect, useRef, useState } from "react";

type CommentsProps = {
	repo: string;
	theme: "github-light" | "github-dark";
};

export function Comments({ repo, theme }: CommentsProps) {
	const commentsRef = useRef<HTMLDivElement>(null);
	const [isIframeReady, setIsIframeReady] = useState(false);

	// 스크립트 로드 및 iframe 로드 감지
	useEffect(() => {
		const commentsElement = commentsRef.current;
		if (!commentsElement) return;

		// 이미 스크립트가 로드되었는지 확인
		const existingScript = commentsElement.querySelector("script[src*='utteranc.es']");
		if (existingScript) return;

		// 현재 DOM의 실제 테마 확인
		const currentTheme = document.documentElement.classList.contains("dark") ? "github-dark" : "github-light";

		const scriptElement = document.createElement("script");
		scriptElement.src = "https://utteranc.es/client.js";
		scriptElement.async = true;
		scriptElement.crossOrigin = "anonymous";
		scriptElement.setAttribute("repo", repo);
		scriptElement.setAttribute("issue-term", "pathname");
		scriptElement.setAttribute("theme", currentTheme);
		scriptElement.setAttribute("label", "comment");

		commentsElement.appendChild(scriptElement);

		// iframe이 생성되고 완전히 로드될 때까지 대기
		const observer = new MutationObserver(() => {
			const iframe = commentsElement.querySelector<HTMLIFrameElement>("iframe.utterances-frame");
			if (iframe) {
				iframe.addEventListener("load", () => {
					setIsIframeReady(true);
					observer.disconnect();
				});
			}
		});

		observer.observe(commentsElement, {
			childList: true,
			subtree: true
		});

		return () => observer.disconnect();
	}, [repo]);

	// 테마 변경 처리 (iframe이 완전히 준비된 후에만)
	useEffect(() => {
		if (!isIframeReady) return;

		const commentsElement = commentsRef.current;
		if (!commentsElement) return;

		const iframe = commentsElement.querySelector<HTMLIFrameElement>("iframe.utterances-frame");
		if (!iframe?.contentWindow) return;

		iframe.contentWindow.postMessage(
			{
				type: "set-theme",
				theme: theme
			},
			"https://utteranc.es"
		);
	}, [theme, isIframeReady]);

	return <div ref={commentsRef} />;
}
