"use client";

import { useRef, useState } from "react";

import CheckIcon from "@/shared/assets/icons/check.svg";
import CopyIcon from "@/shared/assets/icons/copy.svg";
import { cn } from "@/shared/utils";

const COPY_FEEDBACK_DURATION_MS = 2000;

type ShikiCodeBlockProps = {
	html: string;
};

export function ShikiCodeBlock({ html }: ShikiCodeBlockProps) {
	const [copied, setCopied] = useState(false);
	const codeRef = useRef<HTMLDivElement>(null);

	const handleCopy = async () => {
		if (!codeRef.current) return;

		const code = codeRef.current.textContent || "";
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
	};

	return (
		<div ref={codeRef} className="shiki-wrapper relative my-6">
			<div
				dangerouslySetInnerHTML={{ __html: html }}
				className="[&>pre]:bg-secondary [&>pre]:border-primary [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed"
			/>

			<button
				onClick={handleCopy}
				className={cn(
					"absolute top-2 right-2 hidden cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 sm:flex",
					copied ? "bg-accent text-on-accent border-0" : "bg-secondary text-secondary border-primary border"
				)}
				style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
				aria-label="Copy code to clipboard"
			>
				{copied ? (
					<span className="flex items-center gap-1.5">
						<CheckIcon className="size-3.5" aria-hidden="true" />
						Copied!
					</span>
				) : (
					<span className="flex items-center gap-1.5">
						<CopyIcon className="size-3.5" aria-hidden="true" />
						Copy
					</span>
				)}
			</button>
		</div>
	);
}
