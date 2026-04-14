"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type ImageLightboxProps = {
	src: string;
	alt: string;
	onClose: () => void;
};

/**
 * 이미지 확대 오버레이. ESC 키로 닫기, backdrop 클릭으로 닫기.
 * M3에서 MdxImage 연동 시 확대 트리거가 호출.
 */
export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="이미지 확대"
			onClick={onClose}
			className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		>
			{}
			<img
				src={src}
				alt={alt}
				className="max-h-[90vh] max-w-[90vw] rounded-md object-contain"
				onClick={(event) => event.stopPropagation()}
			/>
			<button
				type="button"
				onClick={onClose}
				aria-label="닫기"
				className="focus-visible:ring-ring absolute top-6 right-6 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<X className="size-5" aria-hidden />
			</button>
		</div>
	);
}
