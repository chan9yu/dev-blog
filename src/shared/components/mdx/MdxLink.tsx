import NextLink from "next/link";
import type { ComponentProps } from "react";

type MdxLinkProps = ComponentProps<"a">;

/**
 * 본문 링크. 내부 경로는 next/link, 외부는 target="_blank" + rel="noopener noreferrer".
 * 외부 링크는 스크린리더에 "새 창"을 sr-only로 고지 (WCAG 2.4.4: Link Purpose in Context).
 */
export function MdxLink({ href, children, ...rest }: MdxLinkProps) {
	if (!href) return <span {...rest}>{children}</span>;

	const isExternal = /^https?:\/\//i.test(href);
	if (isExternal) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
				{children}
				<span className="sr-only"> (새 창에서 열림)</span>
			</a>
		);
	}

	return (
		<NextLink href={href} {...rest}>
			{children}
		</NextLink>
	);
}
