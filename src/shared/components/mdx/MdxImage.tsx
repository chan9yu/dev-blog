import Image from "next/image";
import type { ComponentProps } from "react";

export function MdxImage({ alt, ...props }: ComponentProps<typeof Image>) {
	return <Image className="mx-auto" alt={alt || ""} {...props} />;
}

export function MdxImg({ alt, ...props }: ComponentProps<"img">) {
	// eslint-disable-next-line @next/next/no-img-element
	return <img className="mx-auto" alt={alt || ""} {...props} />;
}
