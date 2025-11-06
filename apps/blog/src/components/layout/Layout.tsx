"use client";

import { ReactNode } from "react";
import { Stack } from "ui";
import { Header } from "./Header";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<Stack height="100%" width="100%">
			<Stack height="100%" width="100%">
				<Header />
				<Stack
					component="main"
					height="calc(100% - 80px)"
					overflow="scroll"
					px={3}
					width="100%"
				>
					<Stack
						maxWidth={1024}
						minHeight="100%"
						mt={4}
						mx="auto"
						pb={2}
						width="100%"
					>
						{children}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}
