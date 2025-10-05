import { HTMLAttributes } from "react";
import { highlight } from "sugar-high";

export function MdxCode({ children, ...props }: { children: string } & HTMLAttributes<HTMLElement>) {
	const codeHTML = highlight(children);
	return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}
