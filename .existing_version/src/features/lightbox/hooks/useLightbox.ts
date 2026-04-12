"use client";

import { useState } from "react";

import type { LightboxImage } from "@/features/lightbox/types";

const CLOSE_ANIMATION_DURATION_MS = 300;

/**
 * Lightbox 상태 관리 훅
 */
export function useLightbox() {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [images, setImages] = useState<LightboxImage[]>([]);

	const openLightbox = (imageList: LightboxImage[], index = 0) => {
		setImages(imageList);
		setCurrentIndex(index);
		setIsOpen(true);
	};

	const closeLightbox = () => {
		setIsOpen(false);
		// 애니메이션 종료 후 state 초기화
		setTimeout(() => {
			setImages([]);
			setCurrentIndex(0);
		}, CLOSE_ANIMATION_DURATION_MS);
	};

	return {
		isOpen,
		currentIndex,
		images,
		openLightbox,
		closeLightbox
	};
}
