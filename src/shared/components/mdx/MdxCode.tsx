import type { HTMLAttributes } from "react";

export function MdxCode({ children, ...props }: { children: string } & HTMLAttributes<HTMLElement>) {
	return (
		<code
			{...props}
			className="bg-secondary text-primary rounded-md px-1.5 py-0.5 font-mono text-[0.875em] before:content-none after:content-none"
		>
			{children}
		</code>
	);
}
