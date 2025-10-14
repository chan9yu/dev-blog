"use client";

import type { HTMLAttributes } from "react";
import { useRef, useState } from "react";

import CheckIcon from "@/shared/assets/icons/check.svg";
import CopyIcon from "@/shared/assets/icons/copy.svg";
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
					copied ? "bg-success text-success border-0" : "bg-secondary text-secondary border-primary border"
				)}
				style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
				aria-label="Copy code to clipboard"
			>
				{copied ? (
					<span className="flex items-center gap-1.5">
						<CheckIcon className="size-3.5" />
						Copied!
					</span>
				) : (
					<span className="flex items-center gap-1.5">
						<CopyIcon className="size-3.5" />
						Copy
					</span>
				)}
			</button>
		</div>
	);
}
