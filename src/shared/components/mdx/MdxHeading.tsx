import { Link } from "lucide-react";
import type { ComponentProps } from "react";
import { createElement } from "react";

import { cn } from "@/shared/utils/cn";

type HeadingProps = ComponentProps<"h2"> & {
	level: 2 | 3 | 4;
};

/**
 * 자동 id 부여 + 해시 앵커 링크를 포함한 heading.
 * MDX 렌더 시 `{ h2: (props) => <MdxHeading level={2} {...props} /> }` 형태로 주입.
 * M2에서 remark 플러그인이 heading 텍스트에서 slug를 자동 생성해 id로 주입한다.
 */
export function MdxHeading({ level, id, children, className, ...rest }: HeadingProps) {
	return createElement(
		`h${level}`,
		{
			id,
			className: cn("group scroll-mt-24", className),
			...rest
		},
		id ? (
			<a
				key="anchor"
				href={`#${id}`}
				aria-label={`${typeof children === "string" ? children : "섹션"} 앵커 링크`}
				className="text-muted-foreground hover:text-accent focus-visible:text-accent mr-2 inline-flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
			>
				<Link className="size-4" aria-hidden />
			</a>
		) : null,
		children
	);
}
