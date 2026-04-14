"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/utils/cn";

type ShareButtonsProps = {
	title: string;
	url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	const handleWebShare = async () => {
		if (typeof navigator.share !== "function") return;
		try {
			await navigator.share({ title, url });
		} catch {
			// 사용자 취소 등은 무시
		}
	};

	const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
	const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

	const buttonClass =
		"bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

	return (
		<div className="flex items-center gap-2" aria-label="공유">
			<button
				type="button"
				onClick={handleCopy}
				aria-label={copied ? "링크 복사됨" : "링크 복사"}
				className={buttonClass}
			>
				{copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
			</button>
			<a
				href={xUrl}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="X(Twitter)에 공유"
				className={cn(buttonClass, "text-sm font-semibold")}
			>
				X
			</a>
			<a
				href={linkedInUrl}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn에 공유"
				className={cn(buttonClass, "text-sm font-semibold")}
			>
				in
			</a>
			<button type="button" onClick={handleWebShare} aria-label="기기 공유 시트 열기" className={buttonClass}>
				<Share2 className="size-4" aria-hidden />
			</button>
		</div>
	);
}
