import { Calendar, Clock, Eye } from "lucide-react";
import Link from "next/link";

import type { PostSummary } from "@/shared/types";
import { formatDate } from "@/shared/utils/formatDate";

type PostMetaHeaderProps = {
	post: PostSummary;
};

export function PostMetaHeader({ post }: PostMetaHeaderProps) {
	return (
		<header className="border-border-subtle space-y-4 border-b pb-8">
			<h1 className="text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
				{post.title}
			</h1>
			<p className="text-muted-foreground text-base leading-relaxed text-pretty">{post.description}</p>
			<dl className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
				<div className="inline-flex items-center gap-1.5">
					<Calendar className="size-4" aria-hidden />
					<dt className="sr-only">발행일</dt>
					<dd>
						<time dateTime={post.date}>{formatDate(post.date)}</time>
					</dd>
				</div>
				<div className="inline-flex items-center gap-1.5">
					<Clock className="size-4" aria-hidden />
					<dt className="sr-only">읽기 시간</dt>
					<dd>{post.readingTimeMinutes}분</dd>
				</div>
				<div className="inline-flex items-center gap-1.5">
					<Eye className="size-4" aria-hidden />
					<dt className="sr-only">조회수</dt>
					<dd>—</dd>
				</div>
			</dl>
			{post.tags.length > 0 && (
				<ul className="flex flex-wrap gap-2" aria-label="태그">
					{post.tags.map((tag) => (
						<li key={tag}>
							<Link
								href={`/tags/${tag}`}
								className="bg-muted text-muted-foreground hover:bg-accent/10 focus-visible:ring-ring inline-block rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								<span aria-hidden>#</span>
								{tag}
							</Link>
						</li>
					))}
				</ul>
			)}
		</header>
	);
}
