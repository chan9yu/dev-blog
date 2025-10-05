import Image from "next/image";
import { ComponentProps } from "react";

export function MdxImage({ alt, ...props }: ComponentProps<typeof Image>) {
	return <Image className="rounded-lg" alt={alt || ""} {...props} />;
}
