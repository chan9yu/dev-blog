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

		const scriptElement = document.createElement("script");
		scriptElement.src = "https://utteranc.es/client.js";
		scriptElement.async = true;
		scriptElement.crossOrigin = "anonymous";
		scriptElement.setAttribute("repo", repo);
		scriptElement.setAttribute("issue-term", "pathname");
		scriptElement.setAttribute("theme", theme);
		scriptElement.setAttribute("label", "comment");

		// 기존 댓글 제거 후 새로 추가
		commentsElement.innerHTML = "";
		commentsElement.appendChild(scriptElement);

		return () => {
			commentsElement.innerHTML = "";
		};
	}, [repo, theme]);

	return <div ref={commentsRef} />;
}
