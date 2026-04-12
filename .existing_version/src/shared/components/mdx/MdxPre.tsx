import type { HTMLAttributes, ReactElement } from "react";
import { codeToHtml } from "shiki";

import { ShikiCodeBlock } from "./ShikiCodeBlock";

export async function MdxPre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
	const childElement = children as ReactElement<{ className?: string; children?: string }>;
	const isCodeBlock = childElement?.props?.className?.startsWith("language-");

	if (isCodeBlock && typeof childElement.props.children === "string") {
		const language = childElement.props.className?.replace("language-", "") || "plaintext";
		const code = childElement.props.children;

		// codeToHtml 실행 (try/catch는 JSX 반환 전에만)
		let codeHTML: string;

		try {
			codeHTML = await codeToHtml(code, {
				lang: language,
				themes: {
					light: "github-light",
					dark: "github-dark"
				}
			});
		} catch {
			// 지원하지 않는 언어는 text로 fallback
			console.warn(`Shiki: Language "${language}" is not supported. Falling back to "text".`);

			try {
				codeHTML = await codeToHtml(code, {
					lang: "text",
					themes: {
						light: "github-light",
						dark: "github-dark"
					}
				});
			} catch (fallbackError) {
				// fallback도 실패하면 일반 pre 태그로 렌더링
				console.error("Shiki fallback failed:", fallbackError);
				return (
					<pre {...props}>
						<code>{code}</code>
					</pre>
				);
			}
		}

		return <ShikiCodeBlock html={codeHTML} />;
	}

	return <pre {...props}>{children}</pre>;
}
