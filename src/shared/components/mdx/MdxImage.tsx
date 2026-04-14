import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type MdxImageProps = Omit<ComponentProps<typeof Image>, "alt"> & {
	alt: string;
	caption?: string;
};

/**
 * 본문 이미지. alt 필수 (a11y-auditor가 강제).
 * M3 Lightbox 도입 시 LightboxProvider 슬롯으로 확대 연동 예정.
 */
export function MdxImage({ alt, caption, className, ...rest }: MdxImageProps) {
	return (
		<figure className="my-6">
			<Image alt={alt} className={cn("rounded-lg", className)} {...rest} />
			{caption && <figcaption className="text-muted-foreground mt-2 text-center text-xs italic">{caption}</figcaption>}
		</figure>
	);
}
