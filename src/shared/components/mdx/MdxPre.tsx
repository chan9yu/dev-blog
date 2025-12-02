import type { HTMLAttributes, ReactElement } from "react";
import { codeToHtml } from "shiki";

import { ShikiCodeBlock } from "./ShikiCodeBlock";

export async function MdxPre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
	const childElement = children as ReactElement<{ className?: string; children?: string }>;
	const isCodeBlock = childElement?.props?.className?.startsWith("language-");

	if (isCodeBlock && typeof childElement.props.children === "string") {
		const language = childElement.props.className?.replace("language-", "") || "plaintext";
		const code = childElement.props.children;

		const codeHTML = await codeToHtml(code, {
			lang: language,
			themes: {
				light: "github-light",
				dark: "github-dark"
			}
		});

		return <ShikiCodeBlock html={codeHTML} />;
	}

	return <pre {...props}>{children}</pre>;
}
