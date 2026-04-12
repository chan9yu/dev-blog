"use client";

import { useState } from "react";

import ShareIcon from "@/shared/assets/icons/share.svg";

const TOAST_DISPLAY_DURATION_MS = 2000;

type ShareButtonProps = {
	title: string;
	text?: string;
	url: string;
};

export function ShareButton({ title, text, url }: ShareButtonProps) {
	const [showToast, setShowToast] = useState(false);

	const handleShare = async () => {
		// Web Share API 지원 확인
		if (navigator.share) {
			try {
				await navigator.share({
					title,
					text,
					url
				});
			} catch (error) {
				// 사용자가 공유를 취소한 경우 무시
				if ((error as Error).name !== "AbortError") {
					console.error("Share failed:", error);
					fallbackCopyToClipboard();
				}
			}
		} else {
			// Fallback: 클립보드에 URL 복사
			fallbackCopyToClipboard();
		}
	};

	const fallbackCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setShowToast(true);
			setTimeout(() => setShowToast(false), TOAST_DISPLAY_DURATION_MS);
		} catch (error) {
			console.error("Copy failed:", error);
		}
	};

	return (
		<>
			<button
				onClick={handleShare}
				className="bg-secondary/50 text-secondary hover:bg-secondary hover:text-primary group flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 backdrop-blur-sm transition-all duration-200 sm:gap-2 sm:px-4"
				aria-label="공유하기"
			>
				<ShareIcon className="size-4 transition-transform group-hover:scale-110" aria-hidden="true" />
				<span className="text-xs font-medium sm:text-sm">공유</span>
			</button>

			{/* Toast Notification */}
			{showToast && (
				<div className="animate-fade-in fixed bottom-20 left-1/2 z-50 -translate-x-1/2 sm:bottom-8">
					<div className="bg-elevated border-primary text-primary rounded-lg border px-4 py-2 shadow-lg backdrop-blur-sm sm:px-6 sm:py-3">
						<p className="text-xs font-medium sm:text-sm">링크가 복사되었습니다</p>
					</div>
				</div>
			)}
		</>
	);
}
