import type { HTMLAttributes } from "react";
import { highlight } from "sugar-high";

export function MdxCode({ children, ...props }: { children: string } & HTMLAttributes<HTMLElement>) {
	const isCodeBlock = props.className?.startsWith("language-");

	if (isCodeBlock) {
		const codeHTML = highlight(children);
		return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
	}

	return <code {...props}>{children}</code>;
}
