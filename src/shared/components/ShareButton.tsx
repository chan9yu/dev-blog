"use client";

import { useState } from "react";

import ShareIcon from "@/shared/assets/icons/share.svg";

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
			setTimeout(() => setShowToast(false), 2000);
		} catch (error) {
			console.error("Copy failed:", error);
		}
	};

	return (
		<>
			<button
				onClick={handleShare}
				className="bg-secondary/50 text-secondary hover:bg-secondary hover:text-primary group flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-200"
				aria-label="공유하기"
			>
				<ShareIcon className="size-4 transition-transform group-hover:scale-110" />
				<span className="text-sm font-medium">공유</span>
			</button>

			{/* Toast Notification */}
			{showToast && (
				<div className="animate-fade-in fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
					<div className="bg-elevated border-primary text-primary rounded-lg border px-6 py-3 shadow-lg backdrop-blur-sm">
						<p className="text-sm font-medium">링크가 복사되었습니다</p>
					</div>
				</div>
			)}
		</>
	);
}
