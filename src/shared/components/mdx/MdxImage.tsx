import Image from "next/image";
import type { ComponentProps } from "react";

export function MdxImage({ alt, ...props }: ComponentProps<typeof Image>) {
	return <Image className="mx-auto" alt={alt || ""} {...props} />;
}

/**
 * MDX 이미지 컴포넌트
 * Next.js Image 컴포넌트를 사용하여 자동 최적화
 * Sharp가 내부적으로 WebP, AVIF 생성 및 반응형 이미지 처리
 */
export function MdxImg({ alt, src, ...props }: ComponentProps<"img">) {
	if (!src || typeof src !== "string") {
		// eslint-disable-next-line @next/next/no-img-element
		return <img alt={alt || ""} {...props} />;
	}

	// GIF는 애니메이션 유지를 위해 일반 img 태그 사용
	if (src.endsWith(".gif")) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img className="mx-auto" alt={alt || ""} src={src} {...props} />;
	}

	return (
		<div className="relative my-8 w-full">
			<Image src={src} alt={alt || ""} width={1200} height={675} className="mx-auto rounded-lg" />
		</div>
	);
}
