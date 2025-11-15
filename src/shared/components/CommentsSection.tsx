"use client";

import { GiscusComments } from "./GiscusComments";

type CommentsSectionProps = {
	initialTheme?: "light" | "dark";
};

export function CommentsSection({ initialTheme = "light" }: CommentsSectionProps) {
	return (
		<section className="border-primary mt-16 border-t pt-8">
			<h2 className="text-primary mb-6 text-xl font-bold tracking-tight">댓글</h2>
			<GiscusComments initialTheme={initialTheme} />
		</section>
	);
}
