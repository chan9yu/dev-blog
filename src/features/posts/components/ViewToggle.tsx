"use client";

import { cva } from "class-variance-authority";
import { LayoutGrid, List } from "lucide-react";

import { useHydrated } from "@/shared/hooks/useHydrated";

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
	const hydrated = useHydrated();
	// hydrated gate — server snapshot "list" vs client localStorage "grid" 미스매치(React #418) 차단. PostList와 정합.
	const effectiveView = hydrated ? view : "list";

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
				aria-pressed={effectiveView === "list"}
				className={toggleButton({ active: effectiveView === "list" })}
			>
				<List className="size-4 transition-transform group-hover:scale-110" aria-hidden />
			</button>
			<button
				type="button"
				onClick={handleSelectGridView}
				aria-label="격자 보기"
				aria-pressed={effectiveView === "grid"}
				className={toggleButton({ active: effectiveView === "grid" })}
			>
				<LayoutGrid className="size-4 transition-transform group-hover:scale-110" aria-hidden />
			</button>
		</div>
	);
}
