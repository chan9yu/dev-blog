import NextLink from "next/link";
import type { ComponentProps } from "react";

type MdxLinkProps = ComponentProps<"a">;

/**
 * 본문 링크. 내부 경로는 next/link, 외부는 target="_blank" + rel="noopener noreferrer".
 */
export function MdxLink({ href, children, ...rest }: MdxLinkProps) {
	if (!href) return <span {...rest}>{children}</span>;

	const isExternal = /^https?:\/\//i.test(href);
	if (isExternal) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
				{children}
			</a>
		);
	}

	return (
		<NextLink href={href} {...rest}>
			{children}
		</NextLink>
	);
}
