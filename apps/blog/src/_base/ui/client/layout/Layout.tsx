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
				{children}
			</main>
		</div>
	);
}
