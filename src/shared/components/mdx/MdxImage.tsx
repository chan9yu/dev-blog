import Image from "next/image";
import type { ComponentProps } from "react";

export function MdxImage({ alt, ...props }: ComponentProps<typeof Image>) {
	return <Image className="rounded-lg" alt={alt || ""} {...props} />;
}
