import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type MdxImageProps = ComponentProps<"img"> & {
	/** alt 필수 (a11y-auditor 강제). MDX `![alt](src)` 구문도 항상 전달. */
	alt: string;
	caption?: string;
};

/**
 * 본문 이미지. MDX `![alt](src)` 구문에서 width/height를 전달하지 않으므로
 * next/image 대신 네이티브 <img>를 사용한다. loading="lazy"로 뷰포트 밖 이미지 지연 로드.
 *
 * M3 Lightbox 도입 시 LightboxProvider 슬롯으로 확대 연동 예정.
 * M4+ remark 플러그인으로 이미지 크기를 주입하면 next/image 복귀 가능.
 */
export function MdxImage({ alt, caption, className, ...rest }: MdxImageProps) {
	return (
		<figure className="my-6">
			<img
				alt={alt}
				loading="lazy"
				decoding="async"
				className={cn("mx-auto block h-auto max-w-full rounded-lg", className)}
				{...rest}
			/>
			{caption && <figcaption className="text-muted-foreground mt-2 text-center text-xs italic">{caption}</figcaption>}
		</figure>
	);
}
