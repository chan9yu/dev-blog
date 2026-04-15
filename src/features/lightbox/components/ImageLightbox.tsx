"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";

type ImageLightboxProps = {
	src: string;
	alt: string;
	onClose: () => void;
};

/**
 * 이미지 확대 오버레이. Radix Dialog primitive가 포커스 트랩·ESC·포커스 복원·body scroll lock을 제공.
 * `<img>` 대신 `next/image` fill + unoptimized + object-contain을 사용해 원본 비율 보존 + 최적화 파이프라인 정합(리뷰어 Tier 1 #1).
 * 이전 수동 ESC 핸들러/`document.body.style.overflow` 조작은 Radix에 위임하여 제거.
 */
export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
				<DialogPrimitive.Content className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
					<DialogPrimitive.Title className="sr-only">이미지 확대</DialogPrimitive.Title>
					<DialogPrimitive.Description className="sr-only">{alt}</DialogPrimitive.Description>
					<div className="h-lightbox w-lightbox relative">
						<Image src={src} alt={alt} fill unoptimized sizes="90vw" className="object-contain" />
					</div>
					<DialogPrimitive.Close
						aria-label="이미지 확대 닫기"
						className="focus-visible:ring-ring absolute top-6 right-6 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<X className="size-5" aria-hidden />
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
