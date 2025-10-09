import type { ComponentPropsWithoutRef } from "react";

export function MdxTable(props: ComponentPropsWithoutRef<"table">) {
	return (
		<div className="my-6 w-full overflow-x-auto">
			<table
				className="w-full border-collapse text-sm"
				style={{
					borderColor: "rgb(var(--color-border-primary))",
					tableLayout: "fixed"
				}}
				{...props}
			/>
		</div>
	);
}

export function MdxThead(props: ComponentPropsWithoutRef<"thead">) {
	return <thead className="border-b-2" style={{ borderColor: "rgb(var(--color-border-primary))" }} {...props} />;
}

export function MdxTbody(props: ComponentPropsWithoutRef<"tbody">) {
	return <tbody {...props} />;
}

export function MdxTr(props: ComponentPropsWithoutRef<"tr">) {
	return <tr className="border-b" style={{ borderColor: "rgb(var(--color-border-primary))" }} {...props} />;
}

export function MdxTh(props: ComponentPropsWithoutRef<"th">) {
	return (
		<th
			className="px-3 py-3 text-left text-xs font-semibold sm:px-4 sm:text-sm"
			style={{
				backgroundColor: "rgb(var(--color-bg-secondary))",
				color: "rgb(var(--color-text-primary))",
				wordWrap: "break-word"
			}}
			{...props}
		/>
	);
}

export function MdxTd(props: ComponentPropsWithoutRef<"td">) {
	return (
		<td
			className="px-3 py-3 text-xs sm:px-4 sm:text-sm"
			style={{
				color: "rgb(var(--color-text-secondary))",
				wordWrap: "break-word",
				overflowWrap: "break-word"
			}}
			{...props}
		/>
	);
}
