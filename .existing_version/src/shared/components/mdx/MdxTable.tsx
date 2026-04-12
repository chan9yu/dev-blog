import type { ComponentPropsWithoutRef } from "react";

export function MdxTable(props: ComponentPropsWithoutRef<"table">) {
	return (
		<div className="my-6 w-full overflow-x-auto">
			<table className="border-primary w-full border-collapse text-sm" style={{ tableLayout: "fixed" }} {...props} />
		</div>
	);
}

export function MdxThead(props: ComponentPropsWithoutRef<"thead">) {
	return <thead className="border-primary border-b-2" {...props} />;
}

export function MdxTbody(props: ComponentPropsWithoutRef<"tbody">) {
	return <tbody {...props} />;
}

export function MdxTr(props: ComponentPropsWithoutRef<"tr">) {
	return <tr className="border-primary border-b" {...props} />;
}

export function MdxTh(props: ComponentPropsWithoutRef<"th">) {
	return (
		<th
			className="bg-secondary text-primary px-3 py-3 text-left text-xs font-semibold sm:px-4 sm:text-sm"
			style={{ wordWrap: "break-word" }}
			{...props}
		/>
	);
}

export function MdxTd(props: ComponentPropsWithoutRef<"td">) {
	return (
		<td
			className="text-secondary px-3 py-3 text-xs sm:px-4 sm:text-sm"
			style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
			{...props}
		/>
	);
}
