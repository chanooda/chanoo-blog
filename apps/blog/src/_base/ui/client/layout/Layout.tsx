"use client";

import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<div className="h-dvh w-full">
			<Header />
			<main className="h-[calc(100%-80px)] overflow-scroll px-3 w-full">
				<div className="max-w-5xl mx-auto my-12 w-full min-h-full">
					{children}
				</div>
			</main>
		</div>
	);
}
