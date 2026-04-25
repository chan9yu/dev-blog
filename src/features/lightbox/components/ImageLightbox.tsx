"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect } from "react";

import type { LightboxImage } from "../contexts/LightboxContext";

type ImageLightboxProps = {
	images: ReadonlyArray<LightboxImage>;
	index: number;
	onNext: () => void;
	onPrev: () => void;
	onClose: () => void;
};

/**
 * 이미지 확대 오버레이 — ROADMAP M3-16.
 *
 * Radix Dialog primitive가 포커스 트랩·ESC·포커스 복원·body scroll lock을 제공.
 * 다중 이미지(`images.length > 1`) 시 좌우 화살표 + ArrowLeft/ArrowRight 키보드 nav (circular).
 * `next/image` fill + unoptimized + object-contain으로 원본 비율 보존 + 최적화 파이프라인 정합.
 */
export function ImageLightbox({ images, index, onNext, onPrev, onClose }: ImageLightboxProps) {
	const current = images[index];
	const hasMultiple = images.length > 1;

	useEffect(() => {
		if (!hasMultiple) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") onNext();
			else if (event.key === "ArrowLeft") onPrev();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hasMultiple, onNext, onPrev]);

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose();
	};

	if (!current) return null;

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
				<DialogPrimitive.Content className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
					<DialogPrimitive.Title className="sr-only">이미지 확대</DialogPrimitive.Title>
					<DialogPrimitive.Description className="sr-only">{current.alt}</DialogPrimitive.Description>
					<div className="h-lightbox w-lightbox relative">
						<Image src={current.src} alt={current.alt} fill unoptimized sizes="90vw" className="object-contain" />
					</div>

					{hasMultiple && (
						<>
							<button
								type="button"
								onClick={onPrev}
								aria-label="이전 이미지"
								className="focus-visible:ring-ring absolute top-1/2 left-6 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<ChevronLeft className="size-6" aria-hidden />
							</button>
							<button
								type="button"
								onClick={onNext}
								aria-label="다음 이미지"
								className="focus-visible:ring-ring absolute top-1/2 right-6 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<ChevronRight className="size-6" aria-hidden />
							</button>
						</>
					)}

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
