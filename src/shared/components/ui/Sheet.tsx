"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type SheetRootProps = ComponentProps<typeof SheetPrimitive.Root>;

function SheetRoot({ ...props }: SheetRootProps) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

type SheetTriggerProps = ComponentProps<typeof SheetPrimitive.Trigger>;

function SheetTrigger({ ...props }: SheetTriggerProps) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

type SheetCloseProps = ComponentProps<typeof SheetPrimitive.Close>;

function SheetClose({ ...props }: SheetCloseProps) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal>;

function SheetPortal({ ...props }: SheetPortalProps) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

type SheetOverlayProps = ComponentProps<typeof SheetPrimitive.Overlay>;

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(
				"state-closed:animate-out state-closed:fade-out-0 state-open:animate-in state-open:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className
			)}
			{...props}
		/>
	);
}

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
	side?: "top" | "right" | "bottom" | "left";
	showCloseButton?: boolean;
};

function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }: SheetContentProps) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					"bg-background state-closed:animate-out state-open:animate-in state-closed:duration-300 state-open:duration-500 fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out",
					side === "right" &&
						"state-closed:slide-out-to-right state-open:slide-in-from-right border-border inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
					side === "left" &&
						"state-closed:slide-out-to-left state-open:slide-in-from-left border-border inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
					side === "top" &&
						"state-closed:slide-out-to-top state-open:slide-in-from-top inset-x-0 top-0 h-auto border-b",
					side === "bottom" &&
						"state-closed:slide-out-to-bottom state-open:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
					className
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<SheetPrimitive.Close className="ring-offset-background focus:ring-ring hover:bg-muted absolute top-4 right-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
						<XIcon className="size-4" />
						<span className="sr-only">닫기</span>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

type SheetHeaderProps = ComponentProps<"div">;

function SheetHeader({ className, ...props }: SheetHeaderProps) {
	return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

type SheetFooterProps = ComponentProps<"div">;

function SheetFooter({ className, ...props }: SheetFooterProps) {
	return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title>;

function SheetTitle({ className, ...props }: SheetTitleProps) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn("text-foreground font-semibold", className)}
			{...props}
		/>
	);
}

type SheetDescriptionProps = ComponentProps<typeof SheetPrimitive.Description>;

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export const Sheet = Object.assign(SheetRoot, {
	Trigger: SheetTrigger,
	Close: SheetClose,
	Portal: SheetPortal,
	Overlay: SheetOverlay,
	Content: SheetContent,
	Header: SheetHeader,
	Footer: SheetFooter,
	Title: SheetTitle,
	Description: SheetDescription
});
