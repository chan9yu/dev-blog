"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

const TOAST_DURATION_MS = 2000;

type ShareButtonsProps = {
	title: string;
	url: string;
	text?: string;
};

/**
 * 레거시 ShareButton 디자인:
 * - 단일 "공유" 버튼 (Share 아이콘 + 텍스트)
 * - bg-muted/50 backdrop-blur rounded-lg px-3 py-2 min-h-11
 * - Web Share API 지원 시 native share, 미지원 시 클립보드 복사 + 토스트
 */
export function ShareButtons({ title, url, text }: ShareButtonsProps) {
	const [showToast, setShowToast] = useState(false);

	const handleShare = async () => {
		if (typeof navigator.share === "function") {
			try {
				await navigator.share({ title, url, text });
				return;
			} catch (error) {
				if ((error as Error).name === "AbortError") return;
			}
		}
		try {
			await navigator.clipboard.writeText(url);
			setShowToast(true);
			window.setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
		} catch {
			// 클립보드 실패 시 조용히 무시
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleShare}
				aria-label="공유하기"
				className="bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring group inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 backdrop-blur-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2 sm:px-4"
			>
				<Share2 className="size-4 transition-transform motion-safe:group-hover:scale-110" aria-hidden />
				<span className="text-xs font-medium sm:text-sm">공유</span>
			</button>

			{showToast && (
				<div
					role="status"
					aria-live="polite"
					className="motion-safe:animate-fade-in fixed bottom-20 left-1/2 z-50 -translate-x-1/2 sm:bottom-8"
				>
					<div className="bg-card border-border text-foreground rounded-lg border px-4 py-2 shadow-lg backdrop-blur-sm sm:px-6 sm:py-3">
						<p className="text-xs font-medium sm:text-sm">링크가 복사되었습니다</p>
					</div>
				</div>
			)}
		</>
	);
}
