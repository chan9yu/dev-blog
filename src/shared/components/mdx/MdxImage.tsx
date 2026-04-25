"use client";

import type { ComponentProps, MouseEvent } from "react";

import { type LightboxImage, useLightbox } from "@/features/lightbox";
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
 * **클릭 시 라이트박스 (M3-15/16)**: 같은 `<article>` 내 모든 figure 이미지를 수집해
 * carousel로 표시. trigger img의 인덱스부터 시작. `<button>` wrapper로 키보드(Enter/Space)
 * 활성화 + 스크린 리더에 "확대 보기" 의도 노출.
 *
 * M4+ remark 플러그인으로 이미지 크기를 주입하면 next/image 복귀 가능.
 */
export function MdxImage({ alt, caption, className, src, ...rest }: MdxImageProps) {
	const { openMany } = useLightbox();

	const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
		if (typeof src !== "string" || !src) return;

		const article = event.currentTarget.closest("article");
		const root: ParentNode = article ?? document;
		const imgs = Array.from(root.querySelectorAll<HTMLImageElement>("figure img"));

		const images: LightboxImage[] = imgs
			.map((img) => ({ src: img.currentSrc || img.src, alt: img.alt }))
			.filter((image) => Boolean(image.src));

		if (images.length === 0) return;

		const triggerImg = event.currentTarget.querySelector<HTMLImageElement>("img");
		const triggerIndex = triggerImg ? imgs.indexOf(triggerImg) : -1;
		const startIndex = triggerIndex >= 0 ? triggerIndex : 0;

		openMany(images, startIndex);
	};

	return (
		<figure className="my-6">
			<button
				type="button"
				onClick={handleOpen}
				aria-label={`${alt} — 확대 보기`}
				className="mx-auto block w-fit cursor-zoom-in rounded-lg border-0 bg-transparent p-0"
			>
				<img
					alt={alt}
					loading="lazy"
					decoding="async"
					src={typeof src === "string" ? src : undefined}
					className={cn("block h-auto max-w-full rounded-lg", className)}
					{...rest}
				/>
			</button>
			{caption && <figcaption className="text-muted-foreground mt-2 text-center text-xs italic">{caption}</figcaption>}
		</figure>
	);
}
