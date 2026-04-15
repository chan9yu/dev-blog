import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type ContainerProps = ComponentProps<"div"> & {
	size?: "default" | "prose";
};

export function Container({ size = "default", className, ...rest }: ContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full px-4 sm:px-6 lg:px-8",
				size === "default" && "max-w-6xl",
				size === "prose" && "max-w-prose",
				className
			)}
			{...rest}
		/>
	);
}
