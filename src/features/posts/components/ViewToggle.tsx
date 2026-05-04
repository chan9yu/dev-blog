"use client";

import { cva } from "class-variance-authority";
import { LayoutGrid, List } from "lucide-react";

import { useViewMode } from "../hooks/useViewMode";

const toggleButton = cva(
	"group flex cursor-pointer items-center justify-center rounded-md p-2 transition-all duration-200",
	{
		variants: {
			active: {
				true: "bg-bg-subtle text-foreground shadow-sm",
				false: "text-muted-foreground hover:bg-bg-subtle/50 hover:text-foreground"
			}
		}
	}
);

export function ViewToggle() {
	const { view, setView } = useViewMode();
	const handleSelectListView = () => setView("list");
	const handleSelectGridView = () => setView("grid");

	return (
		<div
			className="bg-secondary/50 hidden items-center gap-1 rounded-lg p-1 backdrop-blur-sm sm:flex"
			role="toolbar"
			aria-label="뷰 모드"
		>
			<button
				type="button"
				onClick={handleSelectListView}
				aria-label="리스트 보기"
				aria-pressed={view === "list"}
				className={toggleButton({ active: view === "list" })}
			>
				<List className="size-4 transition-transform group-hover:scale-110" aria-hidden />
			</button>
			<button
				type="button"
				onClick={handleSelectGridView}
				aria-label="격자 보기"
				aria-pressed={view === "grid"}
				className={toggleButton({ active: view === "grid" })}
			>
				<LayoutGrid className="size-4 transition-transform group-hover:scale-110" aria-hidden />
			</button>
		</div>
	);
}
