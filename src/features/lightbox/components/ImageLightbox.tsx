"use client";

import "yet-another-react-lightbox/styles.css";

import Lightbox from "yet-another-react-lightbox";

import type { LightboxImage } from "@/features/lightbox/types";

type ImageLightboxProps = {
	isOpen: boolean;
	onClose: () => void;
	images: LightboxImage[];
	currentIndex: number;
};

/**
 * 이미지 Lightbox 컴포넌트
 * - yet-another-react-lightbox 사용
 * - ESC, 화살표 키 지원 (라이브러리 기본 기능)
 * - 갤러리 네비게이션
 */
export function ImageLightbox({ isOpen, onClose, images, currentIndex }: ImageLightboxProps) {
	// yet-another-react-lightbox 형식으로 변환
	const slides = images.map((image) => ({
		src: image.src,
		alt: image.alt,
		width: image.width,
		height: image.height
	}));

	return (
		<Lightbox
			open={isOpen}
			close={onClose}
			slides={slides}
			index={currentIndex}
			// 이미지가 1개일 때는 네비게이션 버튼 숨김
			carousel={slides.length === 1 ? { finite: true } : undefined}
			// 키보드 단축키는 기본으로 활성화됨 (ESC, 화살표)
			// 애니메이션 설정
			animation={{ fade: 300 }}
			// 컨트롤러 설정
			controller={{ closeOnBackdropClick: true }}
		/>
	);
}
