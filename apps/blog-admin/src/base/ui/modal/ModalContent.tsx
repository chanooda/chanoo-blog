import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface ModalContentProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
	noBackground?: boolean;
}

export const ModalContent = ({
	noBackground = false,
	children,
	...stackProps
}: ModalContentProps) => {
	return (
		<div
			className={cn(
				"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/50 box-shadow-md",
				!noBackground && "p-2 rounded-md",
			)}
			{...stackProps}
		>
			{children}
		</div>
	);
};
