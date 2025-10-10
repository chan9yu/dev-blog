"use client";

import GridIcon from "@/shared/assets/icons/grid.svg";
import ListIcon from "@/shared/assets/icons/list.svg";
import { cn } from "@/shared/utils";

type ViewToggleProps = {
	view: "list" | "grid";
	onViewChange: (view: "list" | "grid") => void;
};

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<div className="bg-secondary border-primary flex items-center gap-1 rounded-lg border p-1">
			<button
				onClick={() => onViewChange("list")}
				className={cn(
					"flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
					view === "list" ? "bg-elevated text-primary shadow-sm" : "text-secondary hover:bg-tertiary hover:text-primary"
				)}
				aria-label="리스트 보기"
			>
				<ListIcon className="size-4" />
				<span className="hidden sm:inline">리스트</span>
			</button>
			<button
				onClick={() => onViewChange("grid")}
				className={cn(
					"flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
					view === "grid" ? "bg-elevated text-primary shadow-sm" : "text-secondary hover:bg-tertiary hover:text-primary"
				)}
				aria-label="격자 보기"
			>
				<GridIcon className="size-4" />
				<span className="hidden sm:inline">격자</span>
			</button>
		</div>
	);
}
