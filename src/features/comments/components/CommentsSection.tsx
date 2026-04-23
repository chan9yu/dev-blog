"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type CommentsSectionProps = {
	slug: string;
	/** frontmatter.private 값. true면 Giscus 로드 금지 (개인 포스트 노출 방지). */
	isPrivate?: boolean;
};

type GiscusConfig = {
	repo: `${string}/${string}`;
	repoId: string;
	category: string;
	categoryId: string;
};

const GISCUS_ORIGIN = "https://giscus.app";
const GISCUS_SCRIPT_SRC = `${GISCUS_ORIGIN}/client.js`;

/**
 * Giscus 환경변수 4종을 읽고 누락 여부를 반환. `NEXT_PUBLIC_` 접두어 덕에 클라이언트 번들에 인라인.
 * `as const` 타입 assertion으로 Next.js 빌드 타임 string literal 치환과 호환.
 */
function readGiscusConfig(): GiscusConfig | null {
	const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
	const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
	const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
	const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

	if (!repo || !repoId || !category || !categoryId) return null;
	if (!repo.includes("/")) return null;

	return { repo: repo as GiscusConfig["repo"], repoId, category, categoryId };
}

function resolveGiscusTheme(resolvedTheme: string | undefined) {
	return resolvedTheme === "dark" ? "dark" : "light";
}

/**
 * CommentsSection — Giscus(GitHub Discussions) 댓글. ROADMAP M3-12.
 *
 * 라이프사이클:
 * 1. `isPrivate=true` → 비렌더 (개인 포스트)
 * 2. 환경변수 누락 → placeholder + 설정 안내
 * 3. IntersectionObserver 진입 → `giscus.app/client.js` script 주입
 * 4. 테마 변경 → `postMessage` 전파로 iframe 동기화
 * 5. 언마운트 → script 요소 정리
 *
 * **DIY 로더**: `@giscus/react` 미설치 상태라 공식 스크립트를 직접 주입하는 경량 wrapper로 동등 기능 구현.
 */
export function CommentsSection({ slug, isPrivate = false }: CommentsSectionProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const { resolvedTheme } = useTheme();
	const config = readGiscusConfig();

	// IntersectionObserver 기반 lazy-mount — private 여부는 effect 밖에서 처리.
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, []);

	// Giscus script 주입 — intersection 후 config 확보 시점에만 실행.
	useEffect(() => {
		if (!shouldLoad || !config) return;
		const container = containerRef.current;
		if (!container) return;

		const script = document.createElement("script");
		script.src = GISCUS_SCRIPT_SRC;
		script.async = true;
		script.crossOrigin = "anonymous";
		script.dataset.repo = config.repo;
		script.dataset.repoId = config.repoId;
		script.dataset.category = config.category;
		script.dataset.categoryId = config.categoryId;
		script.dataset.mapping = "specific";
		script.dataset.term = slug;
		script.dataset.strict = "1";
		script.dataset.reactionsEnabled = "1";
		script.dataset.emitMetadata = "0";
		script.dataset.inputPosition = "bottom";
		script.dataset.theme = resolveGiscusTheme(resolvedTheme);
		script.dataset.lang = "ko";
		script.dataset.loading = "lazy";

		container.appendChild(script);

		return () => {
			if (script.parentNode) script.parentNode.removeChild(script);
			// 스크립트 실행으로 생성된 iframe도 정리.
			container.querySelector("iframe.giscus-frame")?.remove();
		};
		// `resolvedTheme`은 postMessage 전파 effect가 처리하므로 재주입 회피를 위해 deps에서 제외.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldLoad, slug, config]);

	// 테마 변경 시 Giscus iframe에 postMessage — 스크립트 재주입 없이 테마만 전파.
	useEffect(() => {
		if (!shouldLoad || !config) return;
		const iframe = containerRef.current?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
		if (!iframe?.contentWindow) return;

		iframe.contentWindow.postMessage(
			{ giscus: { setConfig: { theme: resolveGiscusTheme(resolvedTheme) } } },
			GISCUS_ORIGIN
		);
	}, [resolvedTheme, shouldLoad, config]);

	if (isPrivate) return null;

	return (
		<section
			ref={containerRef}
			aria-labelledby="comments-title"
			className="border-border-subtle mt-16 border-t pt-8"
			data-post-slug={slug}
		>
			<h2 id="comments-title" className="text-foreground mb-6 text-xl font-bold tracking-tight">
				댓글
			</h2>

			{!config && (
				<div role="status" className="bg-muted text-muted-foreground min-h-32 rounded-md p-6 text-center text-sm">
					Giscus 환경변수(NEXT_PUBLIC_GISCUS_REPO / REPO_ID / CATEGORY / CATEGORY_ID) 설정 후 댓글이 활성화됩니다.
				</div>
			)}

			{config && !shouldLoad && (
				<div className="bg-muted text-muted-foreground min-h-32 rounded-md p-6 text-center text-sm">
					스크롤하면 댓글이 로드됩니다.
				</div>
			)}
		</section>
	);
}
