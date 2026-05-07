"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState } from "react";

import { EASE_OUT } from "@/shared/utils/motion";

import type { LightboxImage } from "../contexts/LightboxContext";

type ImageLightboxProps = {
	images: ReadonlyArray<LightboxImage>;
	index: number;
	onNext: () => void;
	onPrev: () => void;
	onClose: () => void;
};

// AnimatePresence custom prop으로 direction(+1=next/-1=prev) 전달 → enter/exit 좌우 슬라이드.
const slideVariants = {
	enter: (direction: number) => ({ x: direction * 100, opacity: 0 }),
	center: { x: 0, opacity: 1 },
	exit: (direction: number) => ({ x: -direction * 100, opacity: 0 })
};

// 작은 이미지 깨짐 차단 — width/height=0 + sizes hack은 next/image의 intrinsic 크기 사용 패턴.
// `w-auto h-auto`로 자연 크기 유지, `max-h-lightbox max-w-lightbox`(90vh/90vw)로 큰 이미지만 한도 내 축소.
export function ImageLightbox({ images, index, onNext, onPrev, onClose }: ImageLightboxProps) {
	const current = images[index];
	const hasMultiple = images.length > 1;
	const [direction, setDirection] = useState(0);

	const handleNext = () => {
		setDirection(1);
		onNext();
	};

	const handlePrev = () => {
		setDirection(-1);
		onPrev();
	};

	useEffect(() => {
		if (!hasMultiple) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") handleNext();
			else if (event.key === "ArrowLeft") handlePrev();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasMultiple]);

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose();
	};

	if (!current) return null;

	return (
		<DialogPrimitive.Root open onOpenChange={handleOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
				<DialogPrimitive.Content
					aria-modal="true"
					className="state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4 outline-none"
				>
					<DialogPrimitive.Title className="sr-only">이미지 확대</DialogPrimitive.Title>
					<DialogPrimitive.Description className="sr-only">{current.alt}</DialogPrimitive.Description>
					<AnimatePresence custom={direction} mode="wait" initial={false}>
						<motion.div
							key={index}
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.25, ease: EASE_OUT }}
							className="flex items-center justify-center"
						>
							<Image
								src={current.src}
								alt={current.alt}
								width={0}
								height={0}
								sizes="100vw"
								unoptimized
								className="max-h-lightbox max-w-lightbox h-auto w-auto"
							/>
						</motion.div>
					</AnimatePresence>

					{hasMultiple && (
						<>
							<button
								type="button"
								onClick={handlePrev}
								aria-label="이전 이미지"
								className="focus-visible:ring-ring absolute top-1/2 left-6 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<ChevronLeft className="size-6" aria-hidden />
							</button>
							<button
								type="button"
								onClick={handleNext}
								aria-label="다음 이미지"
								className="focus-visible:ring-ring absolute top-1/2 right-6 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<ChevronRight className="size-6" aria-hidden />
							</button>
						</>
					)}

					<DialogPrimitive.Close
						aria-label="이미지 확대 닫기"
						className="focus-visible:ring-ring absolute top-6 right-6 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<X className="size-5" aria-hidden />
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
