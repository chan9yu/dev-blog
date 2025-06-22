import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { cn } from "@/shared/lib/utils";
import type { BlogTagFilterItem } from "@/shared/types/blog";

type TagSectionProps = {
	selectedTagName: string;
	tags: BlogTagFilterItem[];
};

export default function TagSection({ selectedTagName, tags }: TagSectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>태그 목록</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-3">
					{tags.map((tag) => (
						<Link href={`?tag=${tag.name}`} key={tag.name}>
							<div
								className={cn(
									"hover:bg-muted-foreground/10 text-muted-foreground flex items-center justify-between rounded-md p-1.5 text-sm transition-colors",
									selectedTagName === tag.name && "bg-muted-foreground/10 text-foreground font-medium"
								)}
							>
								<span>{tag.name}</span>
								<span>{tag.count}</span>
							</div>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
