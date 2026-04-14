import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type MdxTableProps = ComponentProps<"table">;

/**
 * 반응형 테이블 래퍼. 좁은 뷰포트에서 가로 스크롤.
 */
export function MdxTable({ className, ...rest }: MdxTableProps) {
	return (
		<div className="border-border-subtle my-6 overflow-x-auto rounded-md border">
			<table className={cn("w-full text-left text-sm", className)} {...rest} />
		</div>
	);
}
