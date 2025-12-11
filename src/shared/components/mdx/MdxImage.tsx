"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

import { useLightboxContext } from "@/features/lightbox";

export function MdxImage({ alt, ...props }: ComponentProps<typeof Image>) {
	return <Image className="mx-auto" alt={alt || ""} {...props} />;
}

export function MdxImg({ alt, src, ...props }: ComponentProps<"img">) {
	const { openLightbox } = useLightboxContext();

	const handleClick = () => {
		if (src && typeof src === "string") {
			openLightbox([{ src, alt }], 0);
		}
	};

	return (
		// eslint-disable-next-line @next/next/no-img-element -- MDX 마크다운 이미지 렌더링용
		<img
			className="mx-auto cursor-pointer transition-opacity hover:opacity-80"
			alt={alt || ""}
			src={src}
			onClick={handleClick}
			{...props}
		/>
	);
}
