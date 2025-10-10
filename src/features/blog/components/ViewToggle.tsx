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
		<div className="bg-secondary/50 hidden items-center gap-1 rounded-lg p-1 backdrop-blur-sm sm:flex">
			<button
				onClick={() => onViewChange("list")}
				className={cn(
					"group flex cursor-pointer items-center justify-center rounded-md p-2 transition-all duration-200",
					view === "list"
						? "bg-elevated text-primary shadow-sm"
						: "text-tertiary hover:bg-tertiary/50 hover:text-secondary"
				)}
				aria-label="리스트 보기"
			>
				<ListIcon className="size-4 transition-transform group-hover:scale-110" />
			</button>
			<button
				onClick={() => onViewChange("grid")}
				className={cn(
					"group flex cursor-pointer items-center justify-center rounded-md p-2 transition-all duration-200",
					view === "grid"
						? "bg-elevated text-primary shadow-sm"
						: "text-tertiary hover:bg-tertiary/50 hover:text-secondary"
				)}
				aria-label="격자 보기"
			>
				<GridIcon className="size-4 transition-transform group-hover:scale-110" />
			</button>
		</div>
	);
}
