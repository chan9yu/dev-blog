"use client";

import type { HTMLAttributes } from "react";
import { useRef, useState } from "react";

import { cn } from "@/shared/utils";

export function MdxPre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!preRef.current) return;

		const code = preRef.current.textContent || "";
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(setCopied, 2000, false);
	};

	return (
		<div className="relative my-6">
			<pre ref={preRef} {...props} className="bg-secondary border-primary overflow-x-auto rounded-lg border p-4">
				{children}
			</pre>
			<button
				onClick={handleCopy}
				className={cn(
					"absolute top-2 right-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105",
					copied ? "border-0 bg-[rgb(120,146,130)] text-white" : "bg-secondary text-secondary border-primary border"
				)}
				style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
				aria-label="Copy code to clipboard"
			>
				{copied ? (
					<span className="flex items-center gap-1.5">
						<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
						Copied!
					</span>
				) : (
					<span className="flex items-center gap-1.5">
						<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						Copy
					</span>
				)}
			</button>
		</div>
	);
}
